import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import InlineConfirmButton from 'react-inline-confirm'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'
import { MB, MINUTE, HOUR, DAY } from '../utils'

import fa from 'font-awesome/css/font-awesome.css'

import { SaveIcon } from '../ui/Icons'

import Panel from '../ui/Panel'
import CheckBox from '../ui/CheckBox'

import uniqueid from 'uniqueid'

const fakeID = uniqueid('fake-')

const textValues = [ 'Delete unit', 'Are you sure?', 'Deleting...' ]

const configPanel = css`
  background-color: ${config.main_background};
  overflow: auto;
  padding: 30px;
  padding-top: 20px;
  max-width: 800px;
`
const heading = css`
  padding: 10px;
  padding-left: 20px;
  font-weight: normal;
  text-transform: uppercase;
  letter-spacing: 1px;
`
const configList = css`
  list-style-type: none;
`
const configItemInput = css`
  margin: 10px !important;
`
const configItemLabel = css`
  text-align: right;
  display: inline-block !important;
  text-align: right;
  // width: 22.5%;
  width: 200px;
  vertical-align: top;
  padding-top: 14px;
`
const nameStyle = css`
  text-align: right;
  width: 20%;
`
const valueStyle = css`
  width: 60%;
`
const remove = css`
  display: inline-block !important;
  border: 0px !important;
`
const formGroup = css`
  // margin: 10px;
  vertical-align: middle;

  & select, & input:not([type=checkbox]):not([type=radio]) , & textarea {
    max-width: 350px;
    vertical-align: middle !important;
  }

  & textarea {
    min-height: 100px;
  }

  & button {
    text-transform: uppercase;
    letter-spacing: 1px;

    & svg {
      margin-right: 5px;
      vertical-align: -1px;
    }
  }
`
const pullRight = css`
  float: right;
`
const pullLeft = css`
  float: left;
`
const clearFix = css`
  overflow: auto;
  clear: both;
  &::after {
    content: "";
    display: table;
  }
`
const configCheckbox = css`
  display: inline-block;
  margin: 10px;
  margin-left: 20px;
`
const redButton = css`
  margin-left: 10px;
  color: red !important;
  border: 1px solid red !important;
  text-transform: uppercase;
  margin-top: 22px;
`
const deleteIcon = css`
  padding: 0 5px;
  color: red;
`
// @TODO: Style it!
class ConfigPanel extends PureComponent {
  constructor (props) {
    super(props)
    const { deployment, unit } = props

    this.state = {
      isDeleting: false,
      parameters: deployment ? deployment.parameters : [],
      name: unit && unit.name,
      deployName: deployment && deployment.name,
      description: unit && unit.description,
      memory: deployment && deployment.memory,
      runInterval: deployment && deployment.runInterval,
      isPublic: unit && unit.public
    }
  }

  handleParamChange = (idx, field) => (e) => {
    const { parameters } = this.state
    const value = e.target.value

    const paramToChange = parameters.filter(param => param.id === idx)[0]

    // check if we're updating existing param or creating a new one
    if (paramToChange) {
      const newParams = parameters.map((param) => {
        if (param.id !== idx) return param

        return { ...param, [field]: value, type: 'secret' }
      })

      this.setState({
        parameters: newParams
      })
    } else {
      this.setState({
        parameters: [
          ...parameters,
          {
            id: idx,
            type: 'secret',
            [field]: value
          }
        ]
      })
    }
  }

  handleChange = (e) => {
    const field = e.target.name
    const value = e.target.value
    this.setState({
      [field]: value
    })
  }

  removeParam = (idx) => () => {
    const { parameters } = this.state
    this.setState({
      parameters: parameters.filter(param => param.id !== idx)
    })
  }

  renderParam = (param) => {
    const { id, name, value } = param
    return (
      <li key={id}>
        <input type='text' name={'name_' + id} className={cx(configItemInput, nameStyle)} defaultValue={name} onChange={this.handleParamChange(id, 'name')} placeholder='name' />:
        <input type='text' name={'value_' + id} className={cx(configItemInput, valueStyle)} defaultValue={value} onChange={this.handleParamChange(id, 'value')} placeholder='value' />
        <button name={'remove_' + id} className={remove} onClick={this.removeParam(id)}>
          <i className={cx(fa.fa, fa['fa-times'])} aria-hidden='true' />
        </button>
      </li>
    )
  }

  renderParameters = () => {
    const { parameters } = this.state

    const emptyParam = {
      id: fakeID(),
      name: '',
      value: '',
      type: 'secret'
    }

    const list = [...parameters, emptyParam].map(this.renderParam)

    return (
      <ul className={configList}>
        { list }
      </ul>
    )
  }

  delete = async (e) => {
    e.preventDefault()

    this.setState({
      isDeleting: true
    })
    await this.props.delete()
    this.setState({
      isDeleting: false
    })
  }

  togglePublic = (isPublic) => {
    this.setState({ isPublic })
  }

  onSave = () => {
    const { parameters, name, deployName, description, memory, runInterval, isPublic } = this.state

    if (this.props.save) {
      this.props.save({
        // unit
        name,
        description,
        public: isPublic,
        parameters
      }, {
        // deployment
        name: deployName,
        memory,
        run_interval: runInterval,
        parameters
      }, true)
    }
  }

  render () {
    const { show, render } = this.props
    const { themeColor } = this.context
    const { isDeleting, name, deployName, description, memory, runInterval, isPublic } = this.state

    const memoryOptions = [ 64, 128, 256 ]

    const deleteButtonIcons = cx(
      fa.fa,
      {[fa['circle-o-notch']]: isDeleting},
      {[fa['fa-spin']]: isDeleting},
      {[fa['fa-trash']]: !isDeleting},
      deleteIcon
    )

    return (
      <Panel className={configPanel} show={show} render={render}>
        <div className={pullRight}>
          <InlineConfirmButton textValues={textValues} showTimer isExecuting={isDeleting} onClick={this.delete} className={redButton}>
            <i className={deleteButtonIcons} />
          </InlineConfirmButton>
        </div>


        <h4 className={heading}>Unit config</h4>
        { this.renderParameters() }
        <div className={clearFix} />

        <h4 className={heading}>Unit settings</h4>
        <div className={formGroup}>
          <label htmlFor='name' className={configItemLabel}>Name </label>
          <input name='name' className={cx(configItemInput)} id='name' onChange={this.handleChange} defaultValue={name} />
        </div>
        <div className={formGroup}>
          <label htmlFor='deployName' className={configItemLabel}>Deployment name </label>
          <input name='deployName' className={cx(configItemInput)} id='deployName' onChange={this.handleChange} defaultValue={deployName} />
        </div>
        <div className={formGroup}>
          <label htmlFor='description' className={configItemLabel}>Description </label>
          <textarea name='description' className={cx(configItemInput)} id='description' onChange={this.handleChange} defaultValue={description} />
        </div>
        <div className={formGroup}>
          <label htmlFor='memory' className={configItemLabel}>Memory </label>
          <select name='memory' className={cx(configItemInput)} id='memory' onChange={this.handleChange} defaultValue={memory}>
            { memoryOptions.map((val) => {
              const valBytes = val * MB
              const params = { value: valBytes, key: valBytes }
              return (<option {...params} key={val}>{val + 'MB'}</option>)
            }) }
          </select>
        </div>
        <div className={formGroup}>
          <label htmlFor='runInterval' className={configItemLabel}>Schedule unit </label>
          <select name='runInterval' className={cx(configItemInput)} id='runInterval' onChange={this.handleChange} defaultValue={runInterval}>
            <option value={0}> Never </option>
            <option value={5 * MINUTE}> Every 5 minutes </option>
            <option value={HOUR}> Every hour </option>
            <option value={DAY}> Every day </option>
          </select>
        </div>
        <div className={clearFix} />
        <br/>
        <div className={cx(formGroup, pullLeft)}>
          <div className={configCheckbox}>
            <CheckBox name='public' isChecked={isPublic} onChange={this.togglePublic} label='publish in Template Library' />
          </div>
        </div>

        <div className={cx(pullRight, formGroup)}>
          <button onClick={this.onSave}>
            <SaveIcon style={{color: themeColor}} /> Save configuration
          </button>
        </div>
      </Panel>
    )
  }
}

ConfigPanel.contextTypes = {
  themeColor: PropTypes.string
}

ConfigPanel.propTypes = {
  deployment: PropTypes.object,
  unit: PropTypes.object,
  delete: PropTypes.func,
  save: PropTypes.func,
  show: PropTypes.bool,
  render: PropTypes.bool
}

export default ConfigPanel
