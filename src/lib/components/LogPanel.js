import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import cx from 'classnames'
import config from '../utils/css.config'

import Log from './Log'
import Foldable from '../ui/Foldable'
import Webhook from './Webhook'
import Panel from '../ui/Panel'
import DebugHttpWidget from './DebugHttpWidget'
import { WrenchIcon } from '../ui/Icons'

const logTypes = ['data', 'patch', 'log']

const logPanel = css`
  background-color: ${config.log_background};
  padding: 15px;
  display: flex;
  flex-direction: column;
  color: #000;
`

const logStream = css`
  flex: 1 1 auto;
  align-self: auto;
  overflow-y: auto;
  overflow-x: hidden;
`
const debugWidgetContainer = css`
  background-color: ${config.main_background};
  padding: 10px;
  margin: -15px;
  margin-bottom: 20px;
`
const debugHttpButton = css`
  font-size: 12px;
  padding: 1px 10px !important;

  & svg {
    vertical-align: middle;
  }
`
const debugButtonPress = css`
  background-color: #e6e6e6;
  border-color: #adadad;
  box-shadow: inset 0 3px 5px rgba(0,0,0,.125);
`

class LogPanel extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {}
  }

  showDebug = event => {
    const {viewDebug} = this.state
    this.setState({
      viewDebug: !viewDebug
    })
  }

  render () {
    const { viewDebug } = this.state
    const { themeColor } = this.context
    const { show, webhook, logUrl, isRunning, runResult, deploymentUrl, onChangeWidgetParameters } = this.props
    const hasResults = runResult && runResult.headers
    const foldableJson = {
      'Request': webhook,
      'Response': hasResults ? runResult.headers : 'running...'
    }
    const hasLogUrl = !!logUrl

    return (

      <Panel className={logPanel} show={show} render>
        <div className={debugWidgetContainer}>
          <button name='toggleDebugHttp' onClick={this.showDebug} className={cx(debugHttpButton, viewDebug && debugButtonPress)}>
            <WrenchIcon style={{stroke: themeColor, fill: '#fff', width: '18px'}}  /> Debug HTTP
          </button>
          { viewDebug
          ? <DebugHttpWidget
            runUrl={deploymentUrl}
            token={localStorage.getItem('devslabToken')}
            onChangeWidgetParameters={onChangeWidgetParameters}
          />
          : null }
        </div>
        { hasLogUrl
          ? <Foldable content={foldableJson} renderKey={'webhook_' + logUrl}>
            <Webhook method={webhook.method} url={deploymentUrl} />
          </Foldable>
          : null}
        { hasLogUrl
          ? <Log url={logUrl} types={logTypes} isRunning={isRunning} className={logStream} logResult={runResult ? runResult.body : {}} />
          : null
        }
      </Panel>
    )
  }
}

LogPanel.contextTypes = {
  themeColor: PropTypes.string
}

LogPanel.propTypes = {
  show: PropTypes.bool,
  webhook: PropTypes.object,
  logUrl: PropTypes.string,
  isRunning: PropTypes.bool,
  runResult: PropTypes.object,
  deploymentUrl: PropTypes.string,
  onChangeWidgetParameters: PropTypes.func
}

export default LogPanel
