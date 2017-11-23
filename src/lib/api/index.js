import {
  sleep,
  getJSON,
  checkRateLimits,
  setEnvironment,
  getBaseUrl,
  getDebugRequest
} from '../utils'

let superagent

if (process.env.NODE_ENV === 'test') {
  superagent = require('superagent').agent()
} else {
  superagent = require('superagent')
}

// @TODO: move to some config
const MAX_RETRY_AFTER = 10000

const request = async function (method, url, opts, parse = true, useToken = true) {
  return new Promise((resolve, reject) => {
    const baseUrl = getBaseUrl()

    method = method.toLowerCase()

    const token = localStorage.getItem('devslabToken') || ''

    const req = superagent[method](baseUrl + url)
      .send(opts.json)
      .set('Accept', 'application/json')
      .withCredentials()

    if (useToken) {
      req.set('Authorization', 'UCKEY=' + token)
    }

    req.end(async function (err, resp) {
      const retryAfter = checkRateLimits(resp)
      if (retryAfter && retryAfter < MAX_RETRY_AFTER) {
        await sleep(retryAfter + 500)

        resolve(await request(method, url, opts))
      }

      if (err) {
        reject(err)
      }

      if (parse) {
        const body = resp.body ? getJSON(resp.body) : (resp.statusCode === '204')

        if (body && body.message && body.message !== 'ok') {
          reject(body.message)
        } else {
          resolve(body)
        }
      } else {
        resolve(resp)
      }
    })
  })
}

const serialize = function (obj) {
  const str = []
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }

  return (str.length > 0 ? '?' + str.join('&') : '')
}

const getUnitUrl = function (data) {
  const url = '/units/'
  if (data.full_name) {
    return url + data.full_name
  } else if (data.owner && data.name) {
    return url + data.owner + '/' + data.name
  } else if (data.id) {
    return url + data.id
  } else {
    return url + data
  }
}

let debugReq = null

const run = async (webhook, unit, user, deployment) => {
  try {
    const token = localStorage.getItem('devslabToken')
    const request = getDebugRequest(webhook, token, unit, user, deployment)

    const { url } = request

    await sleep(10)

    if (debugReq) {
      debugReq.abort()
    }

    let method = ((request !== null ? request.method : undefined) || 'GET').toLowerCase()

    const body = (request !== null ? request.body : undefined) || null

    let headers = {}
    Object.keys(request !== null ? request.headers : undefined)
          .filter(name => (name !== 'User-Agent') && (name !== 'Content-Length'))
          .map((name) => {
            headers[name] = request != null ? request.headers[name] : undefined
            return null
          })

    debugReq = superagent[method](url)
      .set('Accept', 'application/json1')
      .set(headers)
      .send(body)

    const resp = await debugReq

    const retryAfter = checkRateLimits(resp)
    if (retryAfter && retryAfter < MAX_RETRY_AFTER) {
      await sleep(retryAfter + 500)

      const retriedResult = await run(webhook, unit, user, deployment)
      return retriedResult
    }

    if (resp.text) {
      resp.body = resp.text ? getJSON(resp.text) : {}
    }

    return {
      status: resp.status,
      headers: resp.headers,
      body: resp.body || resp.text
    }
  } catch (e) {
    return { status: '', headers: {}, body: { error: e } }
  }
}

const stop = () => {
  if (debugReq) {
    debugReq.abort()
  }
}

export default {
  users: {
    current: function () {
      return request('GET', '/api/user', { })
    },
    load: function (data) {
      return request('POST', '/api/orgs/autologinuser', { json: data }, true, false)
    }
  },
  units: {
    get: function (data) {
      return request('GET', '/api' + getUnitUrl(data), { })
    },
    create: function (data) {
      return request('POST', '/api/units', {
        json: data
      })
    },
    update: function (data) {
      return request('PATCH', '/api' + getUnitUrl(data), {
        json: data
      })
    },
    delete: function (data) {
      return request('DEL', '/api' + getUnitUrl(data), {})
    },
    list: function (condition) {
      return request('GET', '/api/units' + serialize(condition), { })
    },
    templates: function (account = 'demo', condition) {
      // @TODO: change this url to match template's url, for now just use demo user
      return request('GET', `/api/users/${account}/units` + serialize(condition), { })
    },
    user: function (username, condition) {
      return request('GET', '/api/users/' + username + '/units' + serialize(condition), { })
    },
    fork: function (data) {
      return request('POST', '/api' + getUnitUrl(data) + '/forks', { })
    },
    checkStar: function (data) {
      return request('GET', '/api' + getUnitUrl(data) + '/star', {})
    },
    star: function (data) {
      return request('PUT', '/api' + getUnitUrl(data) + '/star', {})
    },
    public: function (condition) {
      return request('GET', '/api/orgs/public' + serialize(condition), {})
    }
  },
  debug: {
    run,
    stop
  },
  deploy: {
    unit: function (data, condition) {
      return request('GET', '/api' + getUnitUrl(data) + '/deployed' + serialize(condition), { })
    },
    create: function (data) {
      return request('POST', '/api' + getUnitUrl(data) + '/deploy', {
        json: data
      })
    },
    update: function (data) {
      return request('PATCH', '/api/deployed/' + data.id, {
        json: data
      })
    }
  },
  docs: {
    unit: async function () {
      const result = await request('GET', '/static/docs', { }, false)
      return result.text
    },
    api: function (data) {
      return request('GET', '/api/search/api' + serialize(data), { })
    },
    package: function (name) {
      return request('GET', '/api/search/package/' + name, { })
    },
    stack: function (name) {
      return request('GET', '/api/search/stack/' + name, { })
    }
  },
  setEnvironment: setEnvironment
}
