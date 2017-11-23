import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'

import { DevsLogo, DevsLogoName, NewUnitIcon, OpenUnitIcon } from '../ui/Icons'

const welcomeWindow = css`
  font-family: ${config.font};
  font-style: normal;
  font-weight: normal;
  font-size: ${config.base_font_size};
  display: flex;
  justify-content: center;
  flex-direction: column;
  background-color: ${config.main_background};
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: absolute !important;
  z-index: 6;
  right: 0;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.25);
`
const buttons = css`
  align-self: center;
  text-align: center;
  display: flex;
  @media (max-width: 640px) {
    flex-direction: column;
  }
`
const buttonCss = css`
  cursor: pointer;
  padding: 2rem;
  color: ${config.muted_text};
  background: ${config.light_background};
  &:hover {
    background: #fafafa;
  }
`
const unitCluster = css`
  align-self: center;
  text-align: center;
  padding: 2rem;
  opacity: 0.2;
  height: 20%;
`
const logoCss = css`
  display: inline-block;
`
const flexGrow = css`
  flex: 1 1 auto;
  order: 0;
  align-self: stretch;
  box-sizing: border-box;
`

class WelcomeWindow extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  createNew = () => {
    this.props.onCreateUnit()
  }

  openExisting = () => {
    this.props.onOpenUnit()
  }

  render () {
    const { themeColor, themeColorLight } = this.context

    return (
      <div className={cx(welcomeWindow, flexGrow)}>
        <div className={buttons}>
          <div className={buttonCss} onClick={this.createNew}>
            <NewUnitIcon style={{color: themeColor}} />
            <p> Create new unit </p>
          </div>

          <div className={buttonCss} onClick={this.openExisting}>
            <OpenUnitIcon style={{color: themeColor}} />
            <p> Open existing </p>
          </div>
        </div>

        <div className={unitCluster}>
          <DevsLogo width='100' height='100' style={{color: themeColor}} lightColor={themeColorLight} className={logoCss} />
          <br />
          <DevsLogoName style={{color: themeColor}} width='150' className={logoCss} />
        </div>
      </div>
    )
  }
}

WelcomeWindow.contextTypes = {
  themeColor: PropTypes.string,
  themeColorLight: PropTypes.string
}

WelcomeWindow.propTypes = {
  onCreateUnit: PropTypes.func,
  onOpenUnit: PropTypes.func
}

export default WelcomeWindow
