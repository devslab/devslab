const KB = 1000
const MB = KB * KB
const GB = KB * MB

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

let baseUrl = ''
const setEnvironment = function (environment) {
  if (environment === 'uceditor') {
    // using devProxy for editor environment
    baseUrl = ''
  } else if (environment === 'ucdev') {
    baseUrl = 'http://vcap.me:3000'
  } else if (environment) {
    baseUrl = environment
  } else {
    baseUrl = 'https://unitcluster.com'
  }
}

const getBaseUrl = function () {
  return baseUrl
}

const getUnitDeployUrl = function (unit, user, deployment) {
  if (unit && user && deployment) {
    const parts = baseUrl.split('://')
    const hasBaseUrl = parts && parts.length === 2

    const isProd = hasBaseUrl && parts[1] === 'unitcluster.com'
    const host = isProd ? 'unit.run' : (hasBaseUrl ? parts[1] : 'vcap.me:3000')
    const protocol = isProd ? 'https:' : window.location.protocol

    const deployUrl = protocol + '//' + user.login + '.' + host + '/' + deployment.name

    return deployUrl
  } else {
    return ''
  }
}

const getUrl = function (webhook, unit, user, deployment) {
  const owner = deployment.owner ? Object.assign({}, deployment.owner) : Object.assign({}, user)

  const url = getUnitDeployUrl(unit, owner, deployment) + (!deployment.public ? '?key=' + user.token : '') // @TODO find why user.token is undefined

  const prefix = url.indexOf('?') > -1 ? '&' : '?'
  const params = webhook.getParams ? prefix + encodeURI(webhook.getParams) : ''

  return url + params
}

const getDebugRequest = (webhook, token, unit, user, deployment) => {
  const { method, contentType, postParams } = webhook
  const hasPostParams = (postParams && postParams.length)

  const headers = {
    Accept: 'application/json',
    'User-Agent': navigator.userAgent
  }

  const url = getUrl(webhook, unit, user, deployment)

  if (token) {
    headers.Authorization = 'UCKEY=' + token
  }

  if (method === 'POST' || method === 'PATCH') {
    headers['Content-Type'] = contentType || 'application/json'
    headers['Content-Length'] = hasPostParams ? postParams.length : void 0
  }

  const isForm = (headers['Content-Type'] === 'application/x-www-form-urlencoded')
  const body = hasPostParams ? (isForm ? encodeURI(postParams) : postParams) : ''

  return {
    method: method,
    url: url,
    headers: headers,
    body: body
  }
}

function sleep (ms = 0) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms))
}

const getJSON = function (data) {
  if (typeof data === 'object') {
    return data
  }
  try {
    data = JSON.parse(data)
  } catch (e) { // eslint-disable-line
  }
  return data
}

const checkRateLimits = function (resp) {
  if (resp.statusCode === 429) {
    const retryAfter = resp.headers['retry-after'] && parseInt(resp.headers['retry-after'], 10)
    if (retryAfter || retryAfter === 0) {
      return (retryAfter * 1000) + 1
    } else {
      // can't access cross-domain headers on error
      try {
        const data = JSON.parse(resp.text)
        if (data && data.retry_in) {
          return data.retry_in
        }
      } catch (e) {
        // @TODO: what to do here?
      }
    }
  }
  return false
}

const prettyDate = function (date) {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }

  const rightNow = new Date().getTime()
  const diff = (rightNow - date.getTime()) / 1000
  const dayDiff = Math.floor(diff / 86400)

  if (isNaN(dayDiff) || dayDiff < 0) {
    return
  }

  return (dayDiff === 0 && (
      (diff < 60 && 'just now') ||
      (diff < 120 && '1 minute ago') ||
      (diff < 3600 && Math.floor(diff / 60) + ' minutes ago') ||
      (diff < 7200 && '1 hour ago') ||
      (diff < 86400 && Math.floor(diff / 3600) + ' hours ago'))) ||
    (dayDiff === 1 && 'Yesterday') ||
    (dayDiff < 7 && dayDiff + ' days ago') ||
    (dayDiff < 31 && Math.ceil(dayDiff / 7) + ' weeks ago') ||
    (dayDiff < 356 && Math.ceil(dayDiff / 30) + ' months ago') ||
    Math.ceil(dayDiff / 365) + ' years'
}

const flatten = object => {
  function _getPath (path, key) {
    if (path && path.length > 0) {
      return `${path}_${key}`
    } else {
      return key
    }
  }
  return Object.assign({}, ...(function _flatten (objectBit, path = '') {  // spread the result into our return object
    if (!objectBit) return objectBit
    return [].concat(                                                       // concat everything into one level
      ...Object.keys(objectBit).map(                                      // iterate over object
        key => typeof objectBit[ key ] === 'object'                       // check if there is a nested object
          ? _flatten(objectBit[ key ], _getPath(path, key))              // call itself if there is
          : ({ [ _getPath(path, key) ]: objectBit[ key ] })                // append object with it’s path as key
      )
    )
  }(object)))
}

module.exports = {
  setEnvironment,
  getBaseUrl,
  getUnitDeployUrl,
  getDebugRequest,
  sleep,
  getJSON,
  checkRateLimits,
  prettyDate,
  flatten,
  KB,
  MB,
  GB,
  SECOND,
  MINUTE,
  HOUR,
  DAY
}
