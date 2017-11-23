import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import config from '../../utils/css.config'
import cx from 'classnames'

const searchResult = css`
  padding: 6px;
  font-size: 10px;
  cursor: pointer;
  position: relative;
  padding: 6px 16px;
  overflow: hidden;
`
const active = css`
  background-color: ${config.panel_background};
`
const resultName = css`
  font-weight: 700;
  padding-right: 8px;
`
const resultVersion = css`
  color: ${config.muted_text};
  padding-right: 8px;
  font-size: 90%;
`

class TabSidebar extends Component {
  render () {
    const { list, name, version, selected } = this.props

    const renderedList = list.map(item => {
      const isSelected = selected === item[name]
      return (
        <div className={cx(searchResult, { [active]: isSelected })} onClick={this.props.onSelect(item)} key={item[name]}>
          <span className={resultName}>{item[name]}</span>
          { version
            ? <span className={resultVersion}>{item[version]}</span>
            : null
          }
        </div>
      )
    })

    return <div>{renderedList}</div>
  }
}

TabSidebar.propTypes = {
  list: PropTypes.array,
  name: PropTypes.string,
  version: PropTypes.string,
  selected: PropTypes.bool,
  onSelect: PropTypes.func
}

export default TabSidebar
