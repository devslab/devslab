import React, { Component } from 'react'
import PropTypes from 'prop-types'

import marked from 'marked'
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

const renderer = new marked.Renderer()

renderer.link = (href, title, text) => {
  return text
}

marked.setOptions({
  renderer: renderer
})

class Npms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: null,
      loading: false,
      contentLoading: false,
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
        const result = await api.docs.api({ npms: true, q: nextProps.moduleName})
        const list = result.results.npms.results.map(item => item.package)

        this.setState({
          loading: false,
          list: list,
          content: await api.docs.package(nextProps.moduleName),
          moduleName: nextProps.moduleName,
          selected: nextProps.moduleName
        })
      } else {
        const result = await api.docs.api({ npms: true, q: nextProps.q })

        this.setState({
          loading: false,
          list: result.results.npms.results.map(item => item.package)
        })
      }
    }
  }

  select = (selected) => async () => {
    this.setState({
      selected: selected.name,
      contentLoading: true
    })

    const content = await api.docs.package(selected.name)

    this.setState({
      contentLoading: false,
      content
    })
  }

  renderContent = () => {
    const { content } = this.state

    const readme = marked(content.readme || '')

    return (
      <div>
        <span className={titleCss}>{ content.name }</span>
        <span>{ content.version }</span>
        { content.link && content.link.length > 1
          ? <a target='_blank' href={content.link} rel='noopener noreferrer'><i className={cx(fa.fa, fa['fa-external-link'])} /></a>
          : ''
        }
        { content.github && content.github.length > 1
          ? <a target='_blank' href={content.github} rel='noopener noreferrer'><i className={cx(fa.fa, fa['fa-github'])} /></a>
          : ''
        }
        <p>{ content.description }</p>
        <hr />
        <Highlight innerHTML>{readme}</Highlight>
      </div>
    )
  }

  render () {
    const { list, loading, selected, content, contentLoading, moduleName } = this.state
    const hasContent = (selected && content) || (moduleName && content)

    return (
      <Tab list={list} loading={loading}>
        <TabSidebar list={list} selected={selected} name='name' version='version' onSelect={this.select} />
        <TabContent hasContent={hasContent} loading={contentLoading} renderContent={this.renderContent} />
      </Tab>
    )
  }
}

Npms.propTypes = {
  q: PropTypes.string
}

export default Npms
