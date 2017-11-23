import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css, keyframes } from 'emotion'
import cx from 'classnames'

const stretchdelay = keyframes`
  0%, 40%, 100% {
    transform: scaleY(0.4)
  }  20% {
    transform: scaleY(1.0)
  }
`
const spinner = css`
  text-align: center;
  font-size: 10px;

  > div {
    display: inline-block;
    animation: ${stretchdelay} 1.2s infinite ease-in-out;
  }
`
const bigStyle = css`
  width: 50px;
  height: 40px;
  margin: 100px auto;

  > div {
    height: 100%;
    width: 6px;
    margin: 0 3px 0 0;
  }
`
const smallStyle = css`
  width: 30px;
  height: 30px;
  margin: 0;
  overflow: hidden;

  > div {
    height: 100%;
    width: 2px;
    margin: 0 2px 0 0;
  }
`
const rect2 = css`
  animation-delay: -1.1s !important;
`
const rect3 = css`
  animation-delay: -1s !important
`
const rect4 = css`
  animation-delay: -0.9s !important
`
const rect5 = css`
  animation-delay: -0.8s !important
`

class LoadingIndicator extends PureComponent {
  render () {
    const { themeColor } = this.context
    const { small } = this.props

    const background = css`
      > div {
        background-color: ${themeColor};
      }
    `
    return (
      <div className={cx(background, spinner, {[bigStyle]: !small}, {[smallStyle]: small})}>
        <div />
        <div className={rect2} />
        <div className={rect3} />
        <div className={rect4} />
        <div className={rect5} />
      </div>
    )
  }
}

LoadingIndicator.contextTypes = {
  themeColor: PropTypes.string
}

LoadingIndicator.propTypes = {
  small: PropTypes.bool
}

export default LoadingIndicator
