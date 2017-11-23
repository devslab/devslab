import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import cx from 'classnames'

import { AutoSizer, List } from 'react-virtualized'

import LoadingIndicator from '../ui/LoadingIndicator'

const logList = css`
  padding: 5px;
`
const logItem = css`
  font-family: monospace;
`
const logRowContent = css`
  display: inline-block;
  white-space: pre;
  font-family: Monaco,Consolas,'Lucida Console','Liberation Mono','DejaVu Sans Mono',Menlo,'Bitstream Vera Sans Mono',Cousine,monospace,'Courier New';
`
// @TODO fix fonts
const resultBorder = '#e4e5e7'
const resultLine = css`
  background-color: white;
  border-right: 1px solid ${resultBorder};
  border-left: 1px solid ${resultBorder};
  box-sizing: border-box;
  padding-left: 10px;
`
const resultLineTop = css`
  border-top: 1px solid ${resultBorder};
`
const resultLineBottom = css`
  border-bottom: 1px solid ${resultBorder};
`

class Log extends PureComponent {
  state = {
    events: [],
    scrollTo: 0,
    listRowHeight: 20,
    overscanRowCount: 10,
    follow: true,
    isLoading: false
  }

  getSource = () => {
    return this.source
  }

  stream = (url) => {
    this.source = new EventSource(url, { withCredentials: true })

    const cb = message => {
      this.setState(prevState => {
        try {
          const data = JSON.parse(message.data)
          const newEvents = prevState.events.concat(data)

          return {
            events: newEvents,
            scrollTo: newEvents.length - 1
          }
        } catch (e) {
          // eslint-disable-line
        }
      })
    }
    this.props.types.forEach(type => {
      this.source.addEventListener(type, cb, false)
    })
    this.source.onerror = (e) => {
      // @TODO: where is my error?
    }
    this.setState({
      isLoading: true
    })
  }

  componentWillReceiveProps = (nextProps) => {
    const hasUrlChanged = (this.props.url !== nextProps.url)
    const hasStoppedRunning = (this.props.isRunning && !nextProps.isRunning)
    const hasResultChanged = (nextProps.logResult && JSON.stringify(this.props.logResult) !== JSON.stringify(nextProps.logResult))

    if (hasUrlChanged) {
      this.setState({
        events: [],
        follow: true
      })
      if (this.source) {
        this.source.close()
      }
      this.stream(nextProps.url)
    }

    if (hasStoppedRunning) {
      if (this.source) {
        this.source.close()
      }
      this.setState({
        isLoading: false
      })
    }

    if (hasResultChanged) {
       if (nextProps.logResult.error) {
        const error = nextProps.logResult.error.response.text
        if (error) {
          const events = this.state.events
            .concat([{ log: '' }, { log: error, color: 'red' }])
          this.setState({
            events: events,
            scrollTo: events.length - 1
          })
          return
        }
      }
      const newLines = JSON.stringify(nextProps.logResult, null, 2).split('\n')
      const linesCount = newLines.length - 1
      const events = this.state.events
                      .concat([{ log: '' }, { log: 'Response:' }])
                      .concat(newLines.map((line, index) => {
                        let className = resultLine
                        if (index === 0) {
                          className = cx(className, resultLineTop)
                        }
                        if (index === linesCount) {
                          className = cx(className, resultLineBottom)
                        }
                        return {
                          log: line,
                          className
                        }
                      }))

      this.setState({
        events: events,
        scrollTo: events.length - 1
      })
    }
  }

  componentDidMount () {
    this.stream(this.props.url)
  }

  componentWillUnmount () {
    if (this.source) {
      this.source.close()
    }
  }

  noRowsRenderer = () => {
    const { isLoading, events } = this.state

    const showLoading = isLoading && (events.length === 0)

    if (showLoading) {
      return (
        <LoadingIndicator />
      )
    } else {
      return null
    }
  }

  rowRenderer = ({ index, key, style }) => {
    const { events } = this.state

    const e = events[index]
    const line = e.log && e.log.split('\n')

    if (!line) return null

    const className = e.className ? cx(logItem, e.className) : logItem
    if (e.color) {
      style.color = e.color
    }

    return (
      <div key={key} style={style} className={className}>
        <div className={logRowContent}>
          {line}
        </div>
      </div>
    )
  }

  onScroll = (event) => {
    const { follow } = this.state
    const { scrollTop, scrollHeight, clientHeight, className } = event.target
    const classes = className.split(' ')

    const scrollDiff = scrollHeight - scrollTop
    const isAutoScroll = clientHeight <= scrollDiff && scrollDiff <= clientHeight + 10
    const isUserScroll = classes.includes('ReactVirtualized__Grid') // user scroll only triggers by this target

    if (isUserScroll) {
      if (follow && !isAutoScroll) {
        this.setState({ follow: false })
      } else if (!follow && scrollDiff === clientHeight) {
        this.setState({ follow: true })
      }
    }
  }

  render () {
    const { events, listRowHeight, overscanRowCount, follow, scrollTo } = this.state
    const { className } = this.props

    return (
      <div onScroll={this.onScroll} className={className}>
        <AutoSizer>
          {({ width, height }) => (
            <List
              className={logList}
              height={height}
              overscanRowCount={overscanRowCount}
              noRowsRenderer={this.noRowsRenderer}
              rowCount={events.length}
              rowHeight={listRowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
              scrollToIndex={follow ? scrollTo : -1}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}

Log.propTypes = {
  className: PropTypes.string,
  types: PropTypes.array,
  url: PropTypes.string,
  isRunning: PropTypes.bool,
  logResult: PropTypes.object
}

export default Log
