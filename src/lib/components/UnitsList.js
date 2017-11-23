import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import cx from 'classnames'

import UnitItem from './UnitItem'
import LoadingIndicator from '../ui/LoadingIndicator'

const container = css`
  width: 100%;
`
const hidden = css`
  display: none;
`

const newUnit = {
  id: 0,
  name: 'Create new',
  description: 'Create new unit',
  isNew: true
}

class UnitsList extends Component {
  loadUnit = (unit) => {
    this.props.onLoadUnit(unit)
  }

  onCreateNew = () => {
    this.props.onCreateNew()
  }

  setRef = (div) => {
    // containerDiv is used by child UnitItem component to decide amount of columns
    this.containerDiv = div
    if (div) {
      this.forceUpdate()
    }
  }

  render () {
    const { units, isLoading, show, onCreateNew, onFork, onStar, showNoResult } = this.props
    const className = cx({ [hidden]: !show }, container)

    const hasUnits = units && units.length > 0
    const canCreateNew = !!onCreateNew

    return (
      <div className={className} ref={this.setRef}>
        { isLoading
          ? <LoadingIndicator />
          : null
        }
        { onCreateNew && !isLoading
          ? <UnitItem unit={newUnit} onClick={this.onCreateNew} containerDiv={this.containerDiv} />
          : null
        }
        { hasUnits && !isLoading
          ? units.map(unit => <UnitItem unit={unit} onClick={this.loadUnit} key={unit.id} onFork={onFork} onStar={onStar} containerDiv={this.containerDiv} />)
          : null
        }
        { !hasUnits && !canCreateNew && showNoResult && !isLoading
          ? <h3>{'Sorry, we couldn\'t find any results for this search'}</h3>
          : null
        }
      </div>
    )
  }
}

UnitsList.propTypes = {
  units: PropTypes.array,
  isLoading: PropTypes.bool,
  show: PropTypes.bool,
  onCreateNew: PropTypes.func,
  onFork: PropTypes.func,
  onStar: PropTypes.func,
  showNoResult: PropTypes.bool,
  onLoadUnit: PropTypes.func
}

export default UnitsList
