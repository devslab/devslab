import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import fa from 'font-awesome/css/font-awesome.css'
import cx from 'classnames'

class Webhook extends PureComponent {
  render () {
    const { method, url } = this.props

    return (
      <div>
        { method } {url}
        <a target='_blank' href={url} rel='noopener noreferrer'><i className={cx(fa.fa, fa['fa-external-link'])} /></a>
      </div>
    )
  }
}

Webhook.propTypes = {
	method: PropTypes.string,
  url: PropTypes.string
}

export default Webhook
