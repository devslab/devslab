import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LoadingIndicator from '../../ui/LoadingIndicator'

import { css } from 'emotion'

const searchContainer = css`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-content: stretch;
  align-items: flex-start;
`
const searchResults = css`
  flex: none;
  order: 0;
  align-self: stretch;
  box-sizing: border-box;
  width: 15%;
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
`
const searchContent = css`
  flex: 1 1 auto;
  order: 0;
  align-self: stretch;
  box-sizing: border-box;
  padding: 5px 5px 5px 15px;
  overflow: hidden;
`

class Tab extends Component {
  render () {
    const { list, loading, children } = this.props

    const sidebar = children[0] || null
    const content = children[1] || null

    const hasResults = (list && list.length > 0)
    const emptyList = (list && list.length === 0)

    if (loading) {
      return <LoadingIndicator />
    } else if (hasResults) {
      return (
        <div className={searchContainer}>
          <div className={searchResults}>
            { sidebar }
          </div>
          <div className={searchContent}>
            { content }
          </div>
        </div>
      )
    } else if (emptyList) {
      return <h3>{'Sorry, we couldn\'t find any results for this search'}</h3>
    } else {
      return <div />
    }
  }
}

Tab.propTypes = {
  list: PropTypes.array,
  loading: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ])
}

export default Tab
