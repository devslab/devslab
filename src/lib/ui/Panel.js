import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'

const panel = css`
  font-family: ${config.font};
  font-style: normal;
  font-weight: normal;
  font-size: ${config.base_font_size};
  width: 90%;
  opacity: 1;
  height: 100%;
  box-sizing: border-box;
  position: absolute !important;
  z-index: 7;
  right: 0;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`
const fadeOut = css`
  width: 0;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 300ms, opacity 300ms, width 300ms;
`
const fadeIn = css`
  width: 90%;
  visibility: visible;
  opacity: 1;
  transition: visibility 0s linear 0s, opacity 300ms, width 300ms;
`

class Panel extends PureComponent {
  render () {
    const { show, children, className, render } = this.props

    return (
      <div className={cx(panel, { [fadeOut]: !show }, { [fadeIn]: show }, className)}>
        { render
          ? children
          : null
        }
      </div>
    )
  }
}

Panel.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]),
  className: PropTypes.string,
  render: PropTypes.bool
}

export default Panel
