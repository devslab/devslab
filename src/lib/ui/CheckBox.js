import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import cx from 'classnames'

const inline = css`
  display: inline-block;
`
const checkboxCss = css`
  position: relative;
  width: 20px;
  height: 20px;
  border: 2px solid #C8CCD4;
  border-radius: 3px;
  box-sizing: border-box;
  display: inline-block;
  vertical-align: middle;
  margin-right: 5px;

  & svg {
    position: absolute;
    top: -2px;
    right: -2px;

    & path {
      fill: none;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 71px;
      stroke-dashoffset: 71px;
      transition: all .6s ease;
    }

    & polyline {
      fill: none;
      stroke: #FFF;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 18px;
      stroke-dashoffset: 18px;
      transition: all .3s ease;
    }
  }
`
const labelCss = css`
  user-select: none;
  cursor: pointer;
  margin-bottom: 0;
  width: auto;

  & input {
    display: none !important;
  }

  & input:checked {
    & + .${checkboxCss} {
      & svg {
        & polyline {
          stroke-dashoffset: 0
        }
      }
    }
  }
  &:hover {
    & .${checkboxCss} {
      & svg {
        & path {
          stroke-dashoffset: 0
        }
      }
    }
  }
`

class CheckBox extends PureComponent {
  toggleCheckboxChange = () => {
    const { onChange, isChecked } = this.props

    onChange && onChange(!isChecked)
  }

  render () {
    const { isChecked, name, label, labelClass, className } = this.props
    const { themeColor } = this.context

    const themedLabel = css`
      & input:checked {
        & + .${checkboxCss} {
          border-color: ${themeColor};
          & svg {
            & path {
              fill: ${themeColor};
            }
          }
        }
      }
    `
    const themedCheckbox = css`
      & svg {
        & path {
          stroke: ${themeColor};
        }
      }
    `

    return (
      <div className={inline}>
        <label htmlFor={name} className={cx(labelCss, themedLabel)}>
          <input
            id={name}
            name={name}
            type='checkbox'
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
            style={{display: 'none'}}
          />
          <div className={cx(checkboxCss, className, themedCheckbox)}>
            <svg width='20px' height='20px' viewBox='0 0 20 20'>
              <path d='M3,1 L17,1 L17,1 C18.1045695,1 19,1.8954305 19,3 L19,17 L19,17 C19,18.1045695 18.1045695,19 17,19 L3,19 L3,19 C1.8954305,19 1,18.1045695 1,17 L1,3 L1,3 C1,1.8954305 1.8954305,1 3,1 Z' />
              <polyline points='4 11 8 15 16 6' />
            </svg>
          </div>
          <span className={labelClass}>{label}</span>
        </label>
      </div>
    )
  }
}

CheckBox.contextTypes = {
  themeColor: PropTypes.string
}

CheckBox.propTypes = {
  onChange: PropTypes.func,
  isChecked: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.string,
  labelClass: PropTypes.string,
  className: PropTypes.string
}

export default CheckBox
