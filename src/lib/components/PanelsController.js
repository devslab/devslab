import React, { PureComponent } from 'react'

// const capitalize = ([first,...rest]) => first.toUpperCase() + rest.join('').toLowerCase()

class PanelsController extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      active: false
    }

    this.toggle = props.panels
                .reduce((acc, value) => {
                  acc[value] = this.togglePanel.bind(this, value)
                  return acc
                }, {})
  }

  togglePanel = (panel, forceOpen = false) => {
    if (forceOpen) {
      this.setState(active: panel)
    } else {
      // using function to prevent situation
      // when user is clicking faster than a state can update
      this.setState(function (prevState, props) {
        const isActive = panel === prevState.active
        return { active: isActive ? false : panel }
      })
    }
  }

  render () {
    const { active } = this.state
    const { panels } = this.props

    const showState = panels
                .reduce((acc, value) => {
                  acc[value] = active === value
                  return acc
                }, {})

    return (
      this.props.children(showState, this.toggle)
    )
  }
}

export default PanelsController
