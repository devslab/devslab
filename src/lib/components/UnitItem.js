import React, { Component } from 'react'
import PropTypes from 'prop-types'

import cx from 'classnames'
import { css } from 'emotion'
import config from '../utils/css.config'

import { StarIcon, DevsLogo } from '../ui/Icons'
import fa from 'font-awesome/css/font-awesome.css'

const templateWrapper = css`
  vertical-align: top;
  display: inline-block;
  width: 33%;
  @media (max-width: 1400px) {
    width: 50%;
  }
`
// const tw3c = css`
//   width: 33.33%;
// `
// const tw2c = css`
//   width: 50%;
// `
// const tw1c = css`
//   width: 100%;
// `
const template = css`
  // height: 89px;
  border: 1px solid ${config.border};
  box-sizing: border-box;
  padding: 10px;
  margin: 20px;
  position: relative;

  & img {
    width: 60px;
    height: 60px;
    padding: 5px;
  }

  // &:hover {
  //   border: 1px solid ${config.main_color};
  // }

  @media (max-width: 550px) {
    height: 130px;
  }
`
const templateInfoName = css`
  line-height: 100%;
  opacity: 1.00;
  cursor: pointer;
`
const templateInfoDesc = css`
  line-height: 150%;
  color: ${config.muted_text};
  opacity: 1.00;
`
const stars = css`
  font-size: 10px;
  line-height: 100%;
  color: ${config.muted_text};
  opacity: 1.00;

  position: absolute;
  bottom: 4px;
  right: 5px;

  & img {
    width: 10px;
    height: 10px;
    padding-bottom: 0px;
  }
`
const hoverButton = css`
  &:hover {
    cursor: pointer;
  }
`
const unitAvatar = css`
  float: left;
  padding-right: 10px;
  cursor: pointer;
`
const clear = css`
  clear: both;
`

// PureComponent doesn't work well here after starring a unit
class UnitItem extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  click = (e) => {
    e.preventDefault()
    e.stopPropagation()

    const { unit, onClick, onStar, onFork } = this.props
    const id = e.target.id

    const starClicked = [`stargazers-${unit.id}`, `stargazersIcon-${unit.id}`].includes(id)
    const forkClicked = [`forks-${unit.id}`, `forksIcon-${unit.id}`].includes(id)

    if (starClicked) {
      onStar ? onStar(unit) : onClick(unit)
    } else if (forkClicked) {
      onFork ? onFork(unit) : onClick(unit)
    } else {
      onClick(unit)
    }
  }

  // getClass = () => {
  //   const { containerDiv } = this.props

  //   if (containerDiv && containerDiv.offsetWidth) {
  //     if (containerDiv.offsetWidth < 450) {
  //       return cx(templateWrapper, tw1c)
  //     } else if (containerDiv.offsetWidth > 1206) {
  //       return cx(templateWrapper, tw3c)
  //     } else {
  //       return cx(templateWrapper, tw2c)
  //     }
  //   } else {
  //     return templateWrapper
  //   }
  // }

  render () {
    const { unit, onFork, onStar } = this.props
    const { themeColor, themeColorLight } = this.context

    // @TODO: ???
    // const templateWrapperClass = this.getClass()

    return (
      <div className={templateWrapper} key={unit.id}>
        <div className={cx(template)} onClick={this.click}>
          <div className={unitAvatar}>
            { unit.isNew
              ? <DevsLogo width='60' height='60' style={{color: themeColor}} lightColor={themeColorLight} />
              : <img src={unit.owner_avatar_url} alt='' />
            }
          </div>
          <div>
            <p className={templateInfoName} style={{color: themeColor}}>{ unit.name }</p>
            <p className={templateInfoDesc}>{ unit.description }</p>
          </div>
          <div className={stars}>
            { onFork
              ? <a className={hoverButton} id={`forks-${unit.id}`} onClick={this.click}>
                <i className={cx(fa.fa, fa['fa-code-fork'])} id={`forksIcon-${unit.id}`} /> Fork
              </a>
              : null
            }
            { onStar
              ? <a className={hoverButton} id={`stargazers-${unit.id}`} onClick={this.click}>
                <StarIcon role='img' aria-label='Stargazers' id={`stargazersIcon-${unit.id}`} /> { unit.stargazers_count }
              </a>
              : null
            }
          </div>
          <div className={clear} />
        </div>
      </div>
    )
  }
}

UnitItem.contextTypes = {
  themeColor: PropTypes.string,
  themeColorLight: PropTypes.string
}

UnitItem.propTypes = {
  unit: PropTypes.object,
  onFork: PropTypes.func,
  onStar: PropTypes.func,
  onClick: PropTypes.func
  // containerDiv: PropTypes.element
}

export default UnitItem
