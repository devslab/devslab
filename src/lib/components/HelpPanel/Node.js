import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Highlight from 'react-highlight'
import '../../assets/css/github-gist.css'

import api from '../../api'

import Tab from './Tab'
import TabSidebar from './TabSidebar'
import TabContent from './TabContent'

import cx from 'classnames'
import fa from 'font-awesome/css/font-awesome.css'
import { css } from 'emotion'
const titleCss = css`
  font-size: 25px;
`

class Node extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: null,
      loading: false,
      selected: false,
      content: null
    }
  }

  componentWillReceiveProps = async (nextProps) => {
    const { q, moduleName } = this.props
    const hasPropsChanged = (q !== nextProps.q && nextProps.q)
    const moduleNameChanged = (moduleName !== nextProps.moduleName && nextProps.moduleName)

    if (hasPropsChanged || moduleNameChanged) {
      this.setState({
        loading: true,
        content: false
      })

      if (moduleNameChanged) {
        const result = await api.docs.api({ node: true, q: nextProps.moduleName})
        const list = result.results.node.results
        const first = list.filter(m => m.name === nextProps.moduleName)[0]

        this.setState({
          loading: false,
          list: list,
          content: first,
          moduleName: nextProps.moduleName,
          selected: first ? first.name : false
        })
      } else {
        const result = await api.docs.api({ node: true, q: nextProps.q})

        this.setState({
          loading: false,
          list: result.results.node.results
        })
      }
    }
  }

  select = (item) => async () => {
    this.setState({
      selected: item.name,
      content: item
    })
  }

  renderParam = (param) => {
    if (param.name && param.type) {
      return (
        <li key={param.name}>
          <code>{ param.name }</code>
          <span>{ ' <' + param.type.split(' | ').join('> | <') + '>' }</span>
          { param.desc
            ? <span>{ ' [' + param.desc + ']' }</span>
            : null
          }
          { param.options
            ? <ul>{param.options.map(this.renderParam)}</ul>
            : null
          }
        </li>
      )
    } else {
      return null
    }
  }

  renderMethod = (method, isMain = false) => {
    const hasParams = method.signatures[0].params

    return (
      <div key={method.textRaw}>
        { isMain
          ? <div>
            <span className={titleCss}>{method.textRaw}</span>
            <a target='_blank' href='https://nodejs.org/api/' rel='noopener noreferrer'><i className={cx(fa.fa, fa['fa-external-link'])} /></a>
            <hr />
          </div>
          : <h3><strong>{method.textRaw}</strong></h3>
        }
        { hasParams
          ? <ul>{method.signatures[0].params.map(this.renderParam)}</ul>
          : null
        }
        { isMain
          ? null
          : <Highlight innerHTML>{method.desc}</Highlight>
        }
      </div>
    )
  }

  renderContent = () => {
    const { content } = this.state
    const isMethod = content && content.type === 'method'

    if (isMethod) {
      return (
        <div>
          {this.renderMethod(content, true)}
          <div dangerouslySetInnerHTML={{__html: content.desc}} />
        </div>
      )
    } else {
      return (
        <div>
          <Highlight innerHTML>{content.desc}</Highlight>
          <hr />
          { content.methods && Object.keys(content.methods).map(id => this.renderMethod(content.methods[id])) }
        </div>
      )
    }
  }

  render () {
    const { list, loading, selected, content } = this.state
    const hasContent = selected && content

    return (
      <Tab list={list} loading={loading}>
        <TabSidebar list={list} selected={selected} name='name' onSelect={this.select} />
        <TabContent hasContent={hasContent} renderContent={this.renderContent} />
      </Tab>
    )
  }
}

Node.propTypes = {
  q: PropTypes.string,
  moduleName: PropTypes.string
}

export default Node
