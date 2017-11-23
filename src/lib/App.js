import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Portal from 'react-portal'

import { css } from 'emotion'
import cx from 'classnames'

import Color from 'color'

import 'notosans-fontface'
import 'font-awesome/css/font-awesome.css'
import 'react-notifications/lib/notifications.css'

import { NotificationContainer, NotificationManager } from 'react-notifications'

import LoadingIndicator from './ui/LoadingIndicator'

import Editor from './components/Editor'
import ControlPanel from './components/ControlPanel'
import TemplatesPanel from './components/TemplatesPanel'
import WelcomeWindow from './components/WelcomeWindow'
import LogPanel from './components/LogPanel'
import ConfigPanel from './components/ConfigPanel'
import HelpPanel from './components/HelpPanel'

import api from './api'

import { getUnitDeployUrl } from './utils'

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React, { exclude: [ /^Notification/, /^CSSTransitionGroup/, /^AutoSizer/ ] })
// }

const workspace = css`
  font-family: "Noto Sans", Nunito, Lato, 'Open Sans', Arial, sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  overflow: hidden;
  z-index: 1;
  height: 99%;
  // width: 99%;

  & a, & button { cursor: pointer }

  & button {
    box-sizing: border-box;
    display: inline-block;
    padding: 10px 15px;
    border-radius: 3px;
  }

  & input:not([type=checkbox]):not([type=radio]) , & select, & textarea {
    padding: 5px 10px;
    box-sizing: border-box;
    display: inline-block
  }

  & input:not([type=checkbox]):not([type=radio]):focus {
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
  }
`
const flex = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: flex-start;
`
const workspaceContent = css`
  position: relative;
`
const flexGrow = css`
  flex: 1 1 auto;
  order: 0;
  align-self: stretch;
  box-sizing: border-box;
`
const flexFixed = css`
  flex: 0 1 auto;
  order: 0;
  align-self: stretch;
  box-sizing: border-box;
`

const PANELS = {
  NONE: null,
  TEMPLATES: 'templates',
  LOG: 'log',
  CONFIG: 'config',
  HELP: 'help'
}

class App extends PureComponent {
  constructor (props) {
    super(props)

    this.onToggleTemplates = this.togglePanel.bind(this, PANELS.TEMPLATES)
    this.onToggleLog = this.togglePanel.bind(this, PANELS.LOG)
    this.onToggleConfig = this.togglePanel.bind(this, PANELS.CONFIG)
    this.onToggleHelp = this.togglePanel.bind(this, PANELS.HELP)

    const { themeColor, editorFontSize, editorFontFamily } = props
    const themeColorLight = Color(themeColor).alpha(0.8).lighten(0.5).toString()
    const workspaceColored = css`
      background-color: #fff;

      & button {
        background: #fff;
        border: 1px solid ${themeColorLight};
        color: ${themeColor};
      }

      & input:not([type=checkbox]):not([type=radio]) , & select, & textarea  {
        background: #fff;
        border: 1px solid ${themeColorLight};
      }
    `
    const className = cx(workspace, flex, workspaceColored)

    const theme = {
      className,
      themeColor,
      themeColorLight,
      editorFontSize,
      editorFontFamily
    }

    this.state = {
      unit: {},
      deployment: null,
      activePanel: PANELS.NONE,
      user: {},
      logUrl: null,
      webhook: { method: 'GET' },
      isRunning: false,
      isSaving: false,
      isLoading: false,
      runResult: null,
      theme
    }
  }

  async componentDidMount () {
    // load "current" user
    const { authId, apiKey, userId, avatar_url, environment } = this.props

    api.setEnvironment(environment)

    try {
      this.setState({
        isLoading: true
      })
      const user = await api.users.load({
        'external_id': userId,
        'org_id': authId,
        'token': apiKey,
        avatar_url
      })
      localStorage.setItem('devslabToken', user.token)
      this.setState({
        user,
        isLoading: false
      })
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Authorization error')
      this.setState({
        isLoading: false
      })
    }
  }

  getChildContext = () => {
    const { themeColor, themeColorLight, editorFontSize, editorFontFamily } = this.state.theme
    const { requireUrl, monacoUrl } = this.props

    return {
      themeColor,
      themeColorLight,
      editorFontSize,
      editorFontFamily,
      requireUrl,
      monacoUrl
    }
  }

  // check if there is at least one deployment
  // or create deployment
  getDeployment = async (unit) => {
    const { deployment } = this.state

    try {
      const deployInState = deployment && deployment.id && (deployment.unit_id === unit.id)
      if (deployInState) {
        return deployment
      } else {
        const findDeployment = await api.deploy.unit(unit, {})
        if (findDeployment.units && findDeployment.units.length > 0) {
          return findDeployment.units[0]
        }

        const createDeployment = await api.deploy.create(unit)
        const updateDeploy = await api.deploy.update({ ...createDeployment, public: false })
        return updateDeploy
      }
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Error loading deployment')
    }
  }

  onSelectUnit = async (data) => {
    try {
      this.setState({
        isLoading: true
      })
      const unit = await api.units.get(data)

      this.setState({
        unit: unit,
        isLoading: false,
        deployment: await this.getDeployment(unit),
        activePanel: PANELS.NONE
      })
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Error loading unit')
      this.setState({
        isLoading: false
      })
    }
  }

  run = async () => {
    const { unit, user, webhook, deployment, activePanel } = this.state
    const token = localStorage.getItem('devslabToken')

    try {
      // const deployment = await this.getDeployment()

      // timestamp is needed so log will reload logs instead of adding new logs to old logs
      const deployUrl = getUnitDeployUrl(unit, user, deployment)
      const logUrl = deployUrl + '/logs?key=' + token + '&_ts=' + Math.floor(Date.now() / 1000)

      this.setState({
        logUrl: logUrl,
        isRunning: true,
        runResult: {}
      })
      if (activePanel !== PANELS.LOG) {
        this.togglePanel(PANELS.LOG)
      }

      const runResult = await api.debug.run(webhook, unit, user, deployment)

      if (runResult.body.error) {
        const msg = runResult.body.error.response.text // @TODO
        NotificationManager.error(msg, 'Debug run error')
      }

      this.setState({
        isRunning: false,
        runResult
      })
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Debug run error')
      this.setState({
        isRunning: false
      })
    }
  }

  runWithParameters = async () => {
    const { parameters, method, contentType, postParams } = this.state
    const webhook = {
      method: method,
      getParams: parameters,
      contentType: contentType,
      postParams: postParams
    }
    await this.setState({
      webhook: webhook
    })
    await this.run()
  }

  onChangeWidgetParameters = async (event) => {
    const field = event.target.name
    let value = event.target.value
    if (field === 'postParams') {
      try {
        value = JSON.stringify(JSON.parse(value))
      } catch (error) {
        value = ''
      }
    }
    await this.setState({
      [field]: value
    })
  }

  stop = () => {
    api.debug.stop()
    this.setState({
      isRunning: false
    })
  }

  togglePanel = (panel) => {
    // using function to prevent situation
    // when user is clicking faster than a state can update
    this.setState(function (prevState, props) {
      const isActive = panel === prevState.activePanel
      return { activePanel: isActive ? PANELS.NONE : panel }
    })
  }

  // @TODO: mb change this if we need to toggle off log panel
  // when clicking anywhere out of log panel
  // currently it's only when we click on Editor itself
  onEditorClick = () => {
    this.togglePanel(PANELS.NONE)
  }

  onApplyTemplate = async (unit) => {
    try {
      this.setState({
        isLoading: true
      })
      const forkedUnit = await api.units.fork(unit)

      const updatedUnit = await api.units.update({
        ...forkedUnit,
        public: false
      })

      this.setState({
        unit: updatedUnit,
        isLoading: false,
        deployment: await this.getDeployment(updatedUnit),
        activePanel: PANELS.NONE
      })
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Error creating unit')
      this.setState({
        isLoading: false
      })
    }
  }

  onCreateNew = async () => {
    const { user } = this.state

    const unit = {
      name: 'integration', // @TODO: required field on UC, come up with something good here
      description: 'Integration', // @TODO: required field on UC, come up with something good here
      public: false,
      owner: user
    }

    try {
      this.setState({
        isLoading: true
      })

      const newUnit = await api.units.create(unit)

      const deployment = await this.getDeployment(newUnit)

      this.setState({
        unit: newUnit,
        deployment,
        isLoading: false,
        activePanel: PANELS.NONE
      })
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Error creating unit')
      this.setState({
        isLoading: false
      })
    }
  }

  save = async (unit, deployment) => {
    unit = unit && unit.id ? unit : this.state.unit
    deployment = deployment && deployment.id ? deployment : this.state.deployment

    this.setState({
      isSaving: true
    })

    try {
      const data = {
        ...unit,
        deployment_id: deployment.id
      }
      const updatedUnit = await api.units.update(data)
      const updateDeploy = await api.deploy.update(deployment)

      NotificationManager.success('', 'Saved successfully!')

      this.setState({
        unit: updatedUnit,
        deployment: updateDeploy,
        isSaving: false
      })
    } catch (e) {
      NotificationManager.error(e.message || e.toString(), 'Error saving unit')
      this.setState({
        isSaving: false
      })
    }
  }

  // @TODO: should we trigger save unit API after this?
  onUnitChange = (unit, save = false) => {
    this.setState({
      unit: {
        ...this.state.unit,
        ...unit
      }
    })
    if (save) {
      setTimeout(() => this.save(), 1000)
    }
  }

  onConfigSave = (unit, deployment, save = false) => {
    this.save({
      ...this.state.unit,
      ...unit
    }, {
      ...this.state.deployment,
      ...deployment
    })
  }

  onKeyDown = (e) => {
    if (e.keyCode === 27) {
      this.setState({
        activePanel: PANELS.NONE
      })
    }
  }

  delete = async (unitId) => {
    const unit = unitId ? { id: unitId } : this.state.unit
    if (unit && unit.id) {
      await api.units.delete(unit)
      this.setState({
        unit: {},
        deployment: null,
        activePanel: PANELS.NONE
      })
    }
  }

  onStarUnit = async (unit) => {
    try {
      // checking if unit is already starred by current user
      await api.units.checkStar(unit)
      return false
    } catch (e) {
      // If we get Not Found error it means that unit is not starred by current user yet
      if (e.message === 'Not Found') {
        // Unit is not starred yet
        await api.units.star(unit)
        NotificationManager.success('', 'Starred successfully!')
        return true
      } else {
        return false
      }
    }
  }

  render () {
    const { user, unit, deployment, isRunning, isSaving, logUrl, webhook, isLoading, runResult, activePanel, theme={} } = this.state

    if (!user || !user.token || isLoading) {
      return <LoadingIndicator />
    }

    const showTemplatesPanel = activePanel === PANELS.TEMPLATES
    const showHelpPanel = activePanel === PANELS.HELP
    const showConfigPanel = activePanel === PANELS.CONFIG
    const showLogPanel = activePanel === PANELS.LOG

    const isUnitLoaded = !!(unit && unit.id)
    const showWelcomeWindow = !(isUnitLoaded || isLoading)

    const deploymentUrl = deployment ? getUnitDeployUrl(unit, user, deployment) : ''

    return (
      <div className={theme.className} tabIndex='0' onKeyDown={this.onKeyDown}>
        {/* editor starts here */}
        <div className={cx(workspaceContent, flexGrow, flex)}>

          { showWelcomeWindow
            ?
            <WelcomeWindow
              onCreateUnit={this.onCreateNew}
              onOpenUnit={this.onToggleTemplates}
            />
            : '' }

          <Editor
            unit={unit}
            deploymentUrl={deploymentUrl}
            run={this.run}
            save={this.save}
            onChange={this.onUnitChange}
            onEditorClick={this.onEditorClick}
            onModuleClick={this.onModuleClick}
            isSaving={isSaving}
          />

          <LogPanel
            logUrl={logUrl}
            webhook={webhook}
            deploymentUrl={deploymentUrl}
            show={showLogPanel}
            runResult={runResult}
            isRunning={isRunning}
            runWithParameters={this.runWithParameters}
            onChangeWidgetParameters={this.onChangeWidgetParameters}
          />

          <TemplatesPanel
            onApplyTemplate={this.onApplyTemplate}
            onLoadUnit={this.onSelectUnit}
            onCreateNew={this.onCreateNew}
            onStar={this.onStarUnit}
            account={this.props.templatesAccount}
            user={user}
            show={showTemplatesPanel}
          />

          <ConfigPanel
            show={showConfigPanel}
            render={isUnitLoaded}
            deployment={deployment}
            unit={unit}
            save={this.onConfigSave}
            delete={this.delete}
          />

          <HelpPanel
            show={showHelpPanel}
            togglePanel={this.onToggleHelp}
          />

        </div>
        <div className={flexFixed}>
          <ControlPanel

            run={this.runWithParameters}
            stop={this.stop}
            save={this.save}

            onToggleTemplates={this.onToggleTemplates}
            onToggleLog={this.onToggleLog}
            onToggleConfig={this.onToggleConfig}
            onToggleHelp={this.onToggleHelp}
            onToggleDebugHttp={this.onToggleDebugHttp}

            activePanel={this.state.activePanel}

            isRunning={isRunning}
            isSaving={isSaving}
            isUnitLoaded={isUnitLoaded}

          />
        </div>
        <Portal isOpened={true}><NotificationContainer /></Portal>
        {/* editor ends */}
      </div>
    )
  }
}

App.defaultProps = {
  editorFontSize: '13px',
  editorFontFamily: "Monaco,Consolas,'Lucida Console','Liberation Mono','DejaVu Sans Mono',Menlo,'Bitstream Vera Sans Mono',Cousine,monospace,'Courier New'",
  requireUrl: 'http://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
  monacoUrl: 'http://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.10.1/min/vs'
}

App.childContextTypes = {
  themeColor: PropTypes.string,
  themeColorLight: PropTypes.string,
  editorFontSize: PropTypes.string,
  editorFontFamily: PropTypes.string,
  requireUrl: PropTypes.string,
  monacoUrl: PropTypes.string
}

App.propTypes = {
  themeColor: PropTypes.string,
  editorFontSize: PropTypes.string,
  editorFontFamily: PropTypes.string,
  templatesAccount: PropTypes.string,
  requireUrl: PropTypes.string,
  monacoUrl: PropTypes.string
}

export default App
