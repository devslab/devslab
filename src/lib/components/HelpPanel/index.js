import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Highlight from 'react-highlight'
import '../../assets/css/github-gist.css'

import api from '../../api'

import { SearchIcon } from '../../ui/Icons'

import Npms from './Npms'
import Js from './Js'
import Node from './Node'
import Panel from '../../ui/Panel'

import { css } from 'emotion'
import config from '../../utils/css.config'
import cx from 'classnames'

import builtins from 'builtins'

const panelCss = css`
  background-color: ${config.main_background};
  position: absolute !important;
  height: 100%;
`
const containerCss = css`
  height: 100%;
  position: relavite;
  padding: 30px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`
const formCss = css`
  position: relative;
`
const searchCss = css`
  background: ${config.main_background} !important;
  box-sizing: border-box !important;
  width: 100% !important;
  padding-left: 10px !important;
`
const searchIconCss = css`
  border-left: 0 !important;
  border-radius: 0 !important;
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  padding: 7.5px 15px !important;
`
const unitAPICss = css`
  // height: 100%;
  overflow-y: auto;

`
const tabItem = css`
  position: relative;
  display: block;
  padding: 10px 15px;

  &:hover {
    cursor: pointer;
  }
`
const tabBody = css`
  padding-bottom: 50px;
`
const active = css`
  display: block;
`
const inactive = css`
  display: none;
`
const tabsList = css`
  width: 95%;
  list-style-type: none;
  border-bottom: 1px solid ${config.border};

  &:after {
    clear: both;
    display: table;
    content: " ";
    box-sizing: border-box;
  }
`
const tabListItem = css`
  float: left;
  margin-bottom: -1px;
  background-color: ${config.main_background};
`
const tabListItemActive = css`
  border: 1px solid ${config.border};
  border-bottom-color: transparent;
  border-radius: 3px 3px 0 0;
  color: ${config.muted_text};
`
// @TODO: come up with more elegant way
const tabsContent = css`
  padding: 0 10px;
  overflow: auto;
  // height: 100%;
  // overflow: hidden;
`

const tabNames = [
  { name: 'unit', label: 'Unit API' },
  { name: 'npms', label: 'NPM' },
  { name: 'node', label: 'Node.js' },
  { name: 'js', label: 'JavaScript' }
]

class HelpPanel extends Component {
  constructor (props) {
    super(props)
    this.state = {
      activeTab: tabNames[0].name,
      q: '',
      search: null,
      unitApi: '',
      searched: false
    }
  }

  async componentDidMount () {
    const { togglePanel } = this.props
    const moduleClickEvent = async (event) => {
      if (event.target.classList.contains('docs-button')) {
        const moduleName = event.target.dataset.token
        this.state.moduleName = moduleName
        if (builtins.indexOf(moduleName) > -1) {
          this.state.activeTab = 'node'
        } else {
          this.state.activeTab = 'npms'
        }
        togglePanel()
        event.target.style.top = event.target.style.left = '-1000px' // hide it
        delete event.target.dataset.token
        event.target.dataset.entered = 'false'
      }
    }

    // need to load Unit API
    this.setState({
      unitApi: await api.docs.unit()
    })
    this.moduleClickEvent = moduleClickEvent.bind(this)
    document.addEventListener('click', this.moduleClickEvent)
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.moduleClickEvent)
  }

  search = async (e) => {
    if (e) {
      e.preventDefault()
    }

    this.setState(function (prevState, props) {
      return { search: prevState.q }
    })
  }

  onChange = (e) => {
    const field = e.target.name
    const value = e.target.value

    this.setState({
      [field]: value
    })
  }

  selectTab = (tab) => () => {
    this.setState({
      activeTab: tab
    })
  }

  renderTabContent = (tab) => {
    const { search, unitApi } = this.state

    switch (tab) {
      case 'unit':
        return <Highlight innerHTML className={unitAPICss}>{unitApi}</Highlight>
      case 'npms':
        return <Npms q={search} moduleName={this.state.moduleName} />
      case 'js':
        return <Js q={search}/>
      case 'node':
        return <Node q={search} moduleName={this.state.moduleName} />
      default:
        return ''
    }
  }

  render () {
    const { show } = this.props
    const { activeTab, moduleName } = this.state
    const { themeColor } = this.context

    const colored = css`
      border-top: 2px solid ${themeColor};
    `
    const tabs = tabNames.map(tab => {
      if (tab.name === 'module' && !moduleName) {
        return null
      }
      const className = cx({ [cx(tabListItemActive, colored)]: (tab.name === activeTab) }, tabListItem)
      return (
        <li key={tab.name} className={className}>
          <a className={tabItem} onClick={this.selectTab(tab.name)}>{ tab.label }</a>
        </li>
      )
    })

    const contents = tabNames.map(tab => {
      const isActive = (tab.name === activeTab)
      const className = cx(tabBody, { [active]: isActive }, { [inactive]: !isActive })

      return (
        <div key={tab.name} className={className}>
          {this.renderTabContent(tab.name)}
        </div>
      )
    })

    return (
      <Panel className={panelCss} show={show} render>
        <div className={containerCss}>
          <form onSubmit={this.search} className={formCss}>
            <input type='text' placeholder='Search...' name='q' className={searchCss} onChange={this.onChange} />
            <button type='submit' className={searchIconCss}>
              <SearchIcon />
            </button>
          </form>
        <ul className={tabsList}>
          {tabs}
        </ul>
        <div className={tabsContent}>
          { contents }
        </div>
        </div>
      </Panel>
    )
  }
}

HelpPanel.contextTypes = {
  themeColor: PropTypes.string
}

HelpPanel.propTypes = {
  show: PropTypes.bool
}

export default HelpPanel
