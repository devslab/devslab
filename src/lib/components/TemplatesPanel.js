import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import api from '../api'
import { flatten } from '../utils'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'

import { NotificationManager } from 'react-notifications'

import UnitsList from './UnitsList'
import Panel from '../ui/Panel'

import { SearchIcon } from '../ui/Icons'

const templatesPanel = css`
  font-family: ${config.font};
  font-style: normal;
  font-weight: normal;
  font-size: ${config.base_font_size};
  // padding: 30px 60px;
  height: 100%;
  background-color: ${config.main_background};
  position: absolute !important;
  z-index: 7;
  right: 0;

  & form {
    position: relative;
  }
`
const templatesContainer = css`
  height: 100%;
  position: relavite;
  padding: 30px 60px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`

const searchIconCss = css`
  button& {
    border: 0 !important;
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    background: transparent !important;
  }
`
// @TODO: come up with more elegant way
const templatesScroll = css`
  height: 100%;
  overflow-y: auto;
  overflow-x: none;
`
// @TODO: make it scale with screen size and .template
const search = css`
  background: ${config.main_background} !important;
  box-sizing: border-box !important;
  line-height: 100% !important;
  color: ${config.muted_text} !important;
  width: 100% !important;
  padding-left: 10px !important;
`
const pressTab = css`
  display: inline;
  border-bottom: 2px solid ${config.tab_inactive};
  // color: ${config.tab_inactive};
  padding: 10px;
  margin: 10px 0 30px 0;
  line-height: 100%;
  cursor: pointer;
`
const pullRight = css`
  float: right;
`
const clear = css`
  clear: both;
`

const starUnit = (starredUnit, unit) => {
  if (starredUnit.id === unit.id) {
    unit.stargazers_count++
  }
  return unit
}

class TemplatesPanel extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      libraryUnits: [],
      userUnits: [],
      publicUnits: [],
      prevQ: null,
      q: '',
      activeTab: 'user',
      isLoading: false,
      perPage: 100 // @TODO: move to some config(?)
    }
  }

  componentDidMount () {
    this.componentMounted = true
  }

  componentWillUnmount () {
    this.componentMounted = false
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.user && nextProps.user !== this.props.user) {
      this.search()
    }

    if (nextProps.show && !this.props.show) {
      setTimeout(() => {
        this.search()
        this.searchInput.focus()
      }, 200) // waiting for css animation first
    }
  }

  delayedSearch = () => {
    setTimeout(() => {
      this.search()
    }, 1000)
  }

  search = async (e) => {
    const { user, account } = this.props
    const { q, prevQ, perPage } = this.state

    if (e) {
      e.preventDefault()
    }

    if (q !== prevQ && this.componentMounted) {
      this.setState({
        isLoading: true
      })
      try {
        const libraryUnits = await api.units.templates(account, { q, per_page: perPage })
        const publicUnits = await api.units.public({ q, per_page: perPage, exclude: account }) // public units of current organization
        const userUnits = await api.units.user(user.login, { q, per_page: perPage })

        this.setState({
          libraryUnits: libraryUnits && libraryUnits.items ? libraryUnits.items.map(flatten) : [],
          userUnits: userUnits && userUnits.items ? userUnits.items.map(flatten) : [],
          publicUnits: publicUnits && publicUnits.items ? publicUnits.items.map(flatten) : [],
          isLoading: false
        })
      } catch (e) {
        NotificationManager.error(e.message || e.toString(), 'Search error')
        this.setState({
          isLoading: false
        })
      }
    }
  }

  onChange = (e) => {
    const field = e.target.name
    const value = e.target.value

    this.setState({
      [field]: value
    })
  }

  changeTab = (activeTab) => {
    this.setState({ activeTab })
  }

  createNew = () => {
    this.props.onCreateNew()
  }

  applyTemplate = (unit) => {
    this.props.onApplyTemplate(unit)
  }

  loadUnit = (unit) => {
    this.props.onLoadUnit(unit)
  }

  renderTabLinks = () => {
    const { activeTab } = this.state
    const { themeColor } = this.context

    const pressTabActive = css`
      border-bottom: 2px solid ${themeColor} !important;
      color: ${themeColor} !important;
      cursor: default;
    `
    return [
      ['user', 'MY UNITS'],
      ['library', 'LIBRARY']
    ].map(item => {
      const [key, name] = item
      const isActive = activeTab === key
      const classes = cx(pressTab, pullRight, {[pressTabActive]: isActive})
      return <div key={key} className={classes} onClick={this.changeTab.bind(this, key)}>{ name }</div>
    })
  }

  onStar = async (unit) => {
    const { onStar } = this.props

    if (onStar) {
      const shouldAddStar = await onStar(unit)

      if (shouldAddStar) {
        const libraryUnits = this.state.libraryUnits.map(libraryUnit => starUnit(unit, libraryUnit))
        const publicUnits = this.state.publicUnits.map(publicUnit => starUnit(unit, publicUnit))

        this.setState({
          libraryUnits,
          publicUnits
        })
      }
    }
  }

  setSearchInput = (el) => {
    this.searchInput = el
  }

  render () {
    const { activeTab, isLoading, libraryUnits, publicUnits, userUnits } = this.state
    const { show } = this.props

    const isLibraryLoading = isLoading || (isLoading === 'library')
    const isUserLoading = isLoading || (isLoading === 'user')

    const isLibraryActive = (activeTab === 'library')
    const isUserActive = (activeTab === 'user')

    const hasLibraryItems = libraryUnits.length > 0 || publicUnits.length > 0

    return (
      <Panel className={templatesPanel} show={show} render>
        <div className={templatesContainer}>
        <div>
          <div className=''>
            { this.renderTabLinks() }
          </div>
          <div className={clear} />
          <form onSubmit={this.search}>
            <input type='text' placeholder='Search...' name='q' className={search} onChange={this.onChange} ref={this.setSearchInput} />
            <button type='submit' className={searchIconCss}>
              <SearchIcon />
            </button>
          </form>
        </div>
        <div className={templatesScroll}>
          <div>
            <UnitsList
              isLoading={isLibraryLoading}
              units={libraryUnits}
              onLoadUnit={this.applyTemplate}
              show={isLibraryActive}
              onStar={this.onStar}
              showNoResult={!hasLibraryItems}
            />
            <UnitsList
              isLoading={isLibraryLoading}
              units={publicUnits}
              onLoadUnit={this.applyTemplate}
              show={isLibraryActive}
              onStar={this.onStar}
            />
          </div>

          <UnitsList
            isLoading={isUserLoading}
            units={userUnits}
            onLoadUnit={this.loadUnit}
            show={isUserActive}
            onCreateNew={this.createNew}
            onFork={this.applyTemplate}
            showNoResult
          />
        </div>
      </div>
      </Panel>
    )
  }
}

TemplatesPanel.contextTypes = {
  themeColor: PropTypes.string
}

TemplatesPanel.propTypes = {
  user: PropTypes.object,
  show: PropTypes.bool,
  onCreateNew: PropTypes.func,
  onApplyTemplate: PropTypes.func,
  onLoadUnit: PropTypes.func
}

export default TemplatesPanel
