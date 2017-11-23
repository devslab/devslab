import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Highlight from 'react-highlight'
import '../../assets/css/github-gist.css'

import api from '../../api'

import Tab from './Tab'
import TabSidebar from './TabSidebar'
import TabContent from './TabContent'

import { css } from 'emotion'
const titleCss = css`
  font-size: 25px;
`

class Js extends Component {
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
    const { q } = this.props
    const hasPropsChanged = (q !== nextProps.q && nextProps.q)

    if (hasPropsChanged) {
      this.setState({
        selected: false,
        loading: true,
        content: false
      })

      const result = await api.docs.api({ js: true, q: nextProps.q })

      this.setState({
        loading: false,
        list: result.results.js.results
      })
    }
  }

  select = (item) => () => {
    this.setState({
      selected: item.path,
      content: item
    })
  }

  renderContent = () => {
    const { content } = this.state

    const codeTag = /<pre data-language="js">([^<]*)<\/pre>/ig

    const description = content.content.replace(codeTag, '<pre><code class="lang-js">$1</code></pre>')
    return (
      <div>
        <span className={titleCss}>{ content.title }</span>
        <Highlight innerHTML>{description}</Highlight>
      </div>
    )
  }

  render () {
    const { list, loading, selected, content } = this.state
    const hasContent = selected && content

    return (
      <Tab list={list} loading={loading}>
        <TabSidebar list={list} selected={selected} name='path' onSelect={this.select} />
        <TabContent hasContent={hasContent} renderContent={this.renderContent} />
      </Tab>
    )
  }
}

Js.propTypes = {
  q: PropTypes.string
}

export default Js
