import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'

import LoadingIndicator from '../ui/LoadingIndicator'

import {
  TemplatesIcon,
  ConfigIcon,
  RunIcon,
  SaveIcon,
  LogIcon,
  HelpIcon
} from '../ui/Icons'

const PANELS = {
  NONE: null,
  TEMPLATES: 'templates',
  LOG: 'log',
  CONFIG: 'config',
  HELP: 'help',
}

const controlPanel = css`
  background-color: ${config.panel_background};
  width: 40px;
  height: 100%;

  & div {
    & button {
      width: 30px;
      height: 30px;
      margin: 5px;
      border-radius: 0px;
      padding: 0;
    }
  }
`
const open = css`
  background-color: ${config.main_background};
  z-index: 22;
  position: relative;
`

class ControlPanel extends PureComponent {
  template = () => {
    this.props.onToggleTemplates()
  }

  run = () => {
    this.props.run()
  }

  stop = () => {
    this.props.stop()
  }

  save = () => {
    this.props.save()
  }

  toggleLog = () => {
    this.props.onToggleLog()
  }

  toggleConfig = () => {
    this.props.onToggleConfig()
  }

  help = () => {
    this.props.onToggleHelp()
  }

  renderUnitControls () {
    const { activePanel, isRunning, isSaving } = this.props
    const { themeColor } = this.context

    const logClass = cx({ [open]: activePanel === PANELS.LOG })
    const configClass = cx({ [open]: activePanel === PANELS.CONFIG })

    return (
      <div>
        { isRunning
          ? <div>
            <button name='stop' onClick={this.stop} title='Stop debug run'>
              <LoadingIndicator small />
            </button>
          </div>
          : <div>
            <button name='run' onClick={this.run} title='Start debug run'>
              <RunIcon style={{color: themeColor}} />
            </button>
          </div>
        }

        { isSaving
          ? <div>
            <button disabled title='Unit is saving...'>
              <LoadingIndicator small />
            </button>
          </div>
          : <div>
            <button name='save' onClick={this.save} title='Save unit'>
              <SaveIcon style={{color: themeColor}} />
            </button>
          </div>
        }

        <div className={logClass}>
          <button name='toggleLog' onClick={this.toggleLog} title='Debug run logs'>
            <LogIcon style={{color: themeColor}} />
          </button>
        </div>

        <div className={configClass}>
          <button name='toggleConfig' onClick={this.toggleConfig} title='Unit configuration'>
            <ConfigIcon style={{color: themeColor}} />
          </button>
        </div>
      </div>
    )
  }

  render () {
    const { activePanel, isUnitLoaded } = this.props
    const { themeColor } = this.context

    const templateClass = cx({ [open]: activePanel === PANELS.TEMPLATES })
    const helpClass = cx({ [open]: activePanel === PANELS.HELP })

    return (
      <div className={controlPanel}>
        <div className={templateClass}>
          <button name='template' onClick={this.template} title='Load or create unit'>
            <TemplatesIcon style={{color: themeColor}} />
          </button>
        </div>

        { isUnitLoaded ? this.renderUnitControls() : '' }

        <div className={helpClass}>
          <button name='help' onClick={this.help} title='Documentation'>
            <HelpIcon style={{color: themeColor}} />
          </button>
        </div>
      </div>
    )
  }
}

ControlPanel.contextTypes = {
  themeColor: PropTypes.string
}

ControlPanel.propTypes = {
  activePanel: PropTypes.string,
  onToggleTemplates: PropTypes.func,
  onToggleLog: PropTypes.func,
  onToggleConfig: PropTypes.func,
  onToggleHelp: PropTypes.func,
  run: PropTypes.func,
  stop: PropTypes.func,
  save: PropTypes.func,
  isRunning: PropTypes.bool,
  isSaving: PropTypes.bool,
  isUnitLoaded: PropTypes.bool
}

export default ControlPanel
