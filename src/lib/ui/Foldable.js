import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'

import fa from 'font-awesome/css/font-awesome.css'

const foldable = css`
  color: ${config.foldable};
  padding: 5px;
`
const foldableTitle = css`
  cursor: pointer;
  & div {
    display: inline-block;
    text-decoration: underline;
  }
  & a {
    padding-left: 5px;
    color: ${config.foldable};
  }
`
const shown = css`
  display: inline-block;
`
const hidden = css`
  display: none;
`

class Foldable extends Component {
  constructor (props) {
    super(props)
    this.state = {
      show: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // do not re-render if we pass renderKey and it's equal to prev renderKey
    // as sometimes we pass a react component as children and PureComponent cannot compare them
    const { renderKey, content } = this.props
    const { show } = this.state

    const didContentChange = content !== nextProps.content
    const didShowChange = show !== nextState.show

    if (renderKey) {
      const didKeyChange = renderKey !== nextProps.renderKey

      return didContentChange || didShowChange || didKeyChange
    }

    return didContentChange || didShowChange
  }

  toggleShow = () => {
    this.setState(function (prevState, props) {
      return { show: !prevState.show }
    })
  }

  render () {
    const { children: title, content } = this.props
    const { show } = this.state

    const defaultValue = ''

    return (
      <div className={foldable}>
        <div className={foldableTitle} onClick={this.toggleShow}>
          { show
            ? <i className={cx(fa.fa, fa['fa-caret-down'])} aria-hidden='true' />
            : <i className={cx(fa.fa, fa['fa-caret-right'])} aria-hidden='true' />
          } { title }
        </div>
        <div className={cx({[shown]: show}, {[hidden]: !show})}>
          <pre>
            { JSON.stringify(content, null, 2) || defaultValue }
          </pre>
        </div>
      </div>
    )
  }
}

Foldable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array
  ]),
  content: PropTypes.object,
  renderKey: PropTypes.string
}

export default Foldable
