import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LoadingIndicator from '../../ui/LoadingIndicator'

import { css } from 'emotion'
import config from '../../utils/css.config'

const readmeCss = css`
  font-size: 15px;
  line-height: 24px;
  padding: 10px 0;
  // height: 85%;
  overflow: hidden;

  & h1, & h2, & h3, & h4, & h5, & h6, & p {
    letter-spacing: 0px;
    font-weight: normal;
    padding: 0.5em 0;
    margin: 0;
  }

  & h1 { font-size: 2em; }
  & h2 { font-size: 1.5em; }
  & h3, & h4, & h5, & h6 { font-size: 1em; }

  & hr {
    border: 0;
    height: 1px;
    background: #333;
    background-image: linear-gradient(to right, #ccc, #333, #ccc);
  }

  & a {
    color: ${config.foldable};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
    & i {
      padding-left: 5px;
    }
  }

  & table {
    font-size: 10px;
    border: 2px solid #fff;
    border-collapse: collapse;
    margin-bottom: 24px;

    & th {
      border: 2px solid #fff;
      border-bottom: 2px solid #d4dde4;
      background: #eaeef2;
      background: rgba(212,221,228,.5);
      padding: 2px 8px 4px;
      font-size: 14px;
      font-weight: 700;
    }

    & td {
      background-color: #f9fafb;
      background-color: rgba(212,221,228,.15);
      border: 2px solid #fff;
      box-shadow: inset 0 -1px 0 0 rgba(212,221,228,.5);
      padding: 6px 8px;
    }
  }
`

class TabContent extends Component {
  render () {
    const { hasContent, loading, renderContent } = this.props

    if (loading) {
      return <LoadingIndicator />
    } else if (hasContent) {
      return (
        <div className={readmeCss}>
          { renderContent() }
        </div>
      )
    } else {
      return null
    }
  }
}

TabContent.propTypes = {
  hasContent: PropTypes.bool,
  loading: PropTypes.bool,
  renderContent: PropTypes.func
}

export default TabContent
