import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import cx from 'classnames'

const debugHttpWidget = css`
  display: flex;
  line-height: 30px;
  margin-top: 10px;
`
const btnUrl = (themeColor) =>  css`
  padding: 6px;
  text-decoration: none;
  color: ${themeColor};
  &:hover {
    text-decoration: underline;
  }
`
const expandAndTruncate = css`
  &, & > * {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
const getParams = css`
  max-width: 260px;
  type: text;
  vertical-align: initial;
`
const nameStyle = css`
  display: inline-block;
  width: 20%;
  height: auto;
`
const valueStyle = css`
  display: inline-block;
  height: auto;
  right: 0px;
`
const block = css`
  display: inline-block;
  width: auto;
  padding: 3px;
`
const halfWideBlock = css`
  margin-top: 10px;
  & label {
    vertical-align: top;
  }
`
const parametersField = css`
  display: inline-block;
`

class DebugHttpWidget extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      parameters: '',
      method: 'GET'
    }
  }

  updateParameters = (event) => {
    this.setState({
      parameters: event.target.value
    })
  }

  handleChangeMethod = (next, event) => {
    this.setState({
      method: event.target.value
    })
    this.forceUpdate()
    next(event)
  }

  renderForm = onChangeWidgetParameters => {
    const formPlaceholder = '{ "param1": "A", "param2": "B" }'
    const availableContentTypes = ["application/json", "application/x-www-form-urlencoded"]

    return (
      <div>
        <div className={halfWideBlock}>
          <label className={nameStyle}>Content-Type:</label>
          <select name='contentType'
            className={cx(valueStyle)}
            onChange={onChangeWidgetParameters}
          >
            {availableContentTypes.map(type => {
              const params = { key: type, value: type }
              return <option {...params} key={type}>{type}</option>
            })}
          </select>
        </div>
        <div className={halfWideBlock}>
          <label className={cx(nameStyle)}>POST parameters:</label>
          <textarea name='postParams'
            placeholder={formPlaceholder}
            className={cx(valueStyle)}
            onChange={onChangeWidgetParameters}
            rows='4'
            cols='40'
          />
        </div>
      </div>
    )
  }

  render () {
    const { token, runUrl, onChangeWidgetParameters } = this.props
    const { themeColor } = this.context

    const supportedMethods = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH' ]

    const runUrlWithToken = runUrl + '?key=' + token
    const inputPlaceholder = ' param1=A&param2=B '
    const btnUrlStyle = btnUrl(themeColor)

    return (
      <div>
        <div className={debugHttpWidget}>
          <div className={block}>
            <label htmlFor='method'>Method: </label>
          </div>
          <div className={block}>
            <select name='method' defaultValue={this.state.method}
            onChange={this.handleChangeMethod.bind(this, onChangeWidgetParameters)}>
            { supportedMethods.map((val) => {
                const params = { method: val, key: val }
                return (<option {...params} key={val}>{val}</option>)
              }) }
            </select>
          </div>
          <div className={cx(block, expandAndTruncate)}>
            <a className={btnUrlStyle} target='_blank' href={runUrlWithToken}>{runUrlWithToken}</a>
          </div>
          <div className={parametersField}>
            <input name='parameters'
              placeholder={inputPlaceholder}
              className={getParams}
              onChange={onChangeWidgetParameters}
            />
          </div>
        </div>
        { this.state.method !== 'GET' ? this.renderForm(onChangeWidgetParameters) : null }
      </div>
    )
  }
}

DebugHttpWidget.contextTypes = {
  themeColor: PropTypes.string
}

DebugHttpWidget.propTypes = {
  token: PropTypes.string,
  runUrl: PropTypes.string,
  onChangeWidgetParameters: PropTypes.func
}

export default DebugHttpWidget
