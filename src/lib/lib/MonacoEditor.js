/* Forked from https://github.com/superRaytin/react-monaco-editor for more control over themes, tokenization, size, etc

The MIT License (MIT)

Copyright (c) 2016-present Leon Shi

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
import React from 'react'
import PropTypes from 'prop-types'

import { css } from 'emotion'
import cx from 'classnames'

import _ from 'underscore'

import jsTokenTheme from './jsTokenTheme'

const monacoEditorContainer = css`
  overflow: hidden;
  z-index: 1;
  height: 90% !important;

  & .monaco-tree-row * {
    display: float !important;
    padding: 0 !important;
  }

  & token.module * {
    color: rgb(255, 0, 255);
  }
`

function noop () {}

// 'UnitClusterTheme'
const theme = {
  base: 'vs', // can also be vs-dark or hc-black
  inherit: true, // can also be false to completely replace the builtin rules
  rules: [
    { token: 'comment', foreground: 'a3a7a9' },
    { token: 'keyword', foreground: 'ee4444' },
    { token: 'identifier', foreground: '1055af' },
    { token: 'delimiter.bracket', foreground: '000000' },
    { token: 'delimiter', foreground: '000000' },
    { token: 'string', foreground: '20aa20' },
    { token: 'module', foreground: 'ff0034'}
  ]
}

class MonacoEditor extends React.Component {
  constructor (props) {
    super(props)
    this.__current_value = props.value
    this.moduleClickEventFunc = null
  }

  componentDidMount () {
    this.afterViewInit()
    window.addEventListener('resize', this.setSize)
  }

  componentWillUnmount () {
    this.destroyMonaco()
    window.removeEventListener('resize', this.setSize)
  }

  componentDidUpdate (prevProps) {
    const context = this.props.context || window

    const valueChanged = this.props.value !== this.__current_value
    const languageChanged = prevProps.language !== this.props.language
    const optionsChanged = prevProps.options && this.props.options && (JSON.stringify(prevProps.options) !== JSON.stringify(this.props.options))

    if (valueChanged) {
      // Always refer to the latest value
      this.__current_value = this.props.value
      // Consider the situation of rendering 1+ times before the editor mounted
      if (this.editor) {
        this.__prevent_trigger_change_event = true
        this.editor.setValue(this.__current_value)
        this.__prevent_trigger_change_event = false
      }
    }

    if (languageChanged) {
      context.monaco.editor.setModelLanguage(this.editor.getModel(), this.props.language)
    }

    if (optionsChanged) {
      this.editor.updateOptions(this.props.options)
    }

    this.getModuleTokens(this.editor)
  }

  editorWillMount (monaco) {
    const { editorWillMount } = this.props
    editorWillMount(monaco)
  }

  editorDidMount (editor, monaco) {
    const { editorDidMount, onChange } = this.props
    editorDidMount(editor, monaco)
    this.getModuleTokens(this.editor)

    editor.onDidChangeModelContent(event => {
      const value = editor.getValue()

      // Always refer to the latest value
      this.__current_value = value

      // Only invoking when user input changed
      if (!this.__prevent_trigger_change_event) {
        onChange(value, event)
      }
    })
  }

  addDocumentationButton (editor) {
    function hoverWidgetOnOverlay(monaco, overlayClass, widget) {
      monaco.appendChild(widget)
      widget.style.position = 'fixed'
      widget.style.zIndex = 100000
      widget.style.top = widget.style.left = '-1000px' // hide it
      widget.dataset.token = null

      monaco.addEventListener('mousemove', e => {
        let onToken = e.target.classList.contains(overlayClass)
        if (onToken && e.target.innerText !== widget.dataset.token) { // entered token, show widget
          const rect = e.target.getBoundingClientRect()
          widget.style.left = rect.left + 'px'
          widget.style.top = rect.bottom + 'px'
          widget.dataset.token = e.target.innerText
          widget.innerHTML = 'Open documentation for ' + widget.dataset.token
          if (typeof widget.onShown === 'function') widget.onShown()

        } else if ((e.target === widget || widget.contains(e.target))) { // entered widget, call widget.onEntered
          if (widget.dataset.entered === 'true' && typeof widget.onEntered === 'function')  widget.onEntered()
          widget.dataset.entered = 'true'

        } else if (!onToken && widget.style.left !== '-1000px') { // we stepped outside
          widget.style.top = widget.style.left = '-1000px' // hide it
          delete widget.dataset.token
          widget.dataset.entered = 'false'
          if (typeof widget.onHidden === 'function') widget.onHidden()
        }

        return true
      })
    }

    let widget = document.createElement('button')
    widget.innerHTML = 'Open documentation for ...'
    widget.className = 'docs-button'
    const monaco = document.getElementsByClassName('monaco-editor vs')[0]
    hoverWidgetOnOverlay(monaco, 'editor-npm-module', widget)
  }

  afterViewInit () {
    const { requireConfig } = this.props
    const loaderUrl = requireConfig.url || 'vs/loader.js'
    const context = this.props.context || window

    const onGotAmdLoader = () => {
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        // Do not use webpack
        if (requireConfig.paths && requireConfig.paths.vs) {
          context.require.config(requireConfig)
        }
      }

      // @TODO: need to create monaco-editor-worker-loader-proxy.js as in here https://github.com/Microsoft/monaco-editor#integrate-cross-domain
      // window.MonacoEnvironment = {
      //   getWorkerUrl: function(workerId, label) {
      //     return 'monaco-editor-worker-loader-proxy.js'
      //   }
      // }

      // Load monaco
      context.require(['vs/editor/editor.main'], () => {
        window.monaco.languages.setMonarchTokensProvider('javascript', jsTokenTheme)
        window.monaco.editor.defineTheme('UnitClusterTheme', theme)
        this.initMonaco()
      })

      // Call the delayed callbacks when AMD loader has been loaded
      if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = false
        let loaderCallbacks = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__
        if (loaderCallbacks && loaderCallbacks.length) {
          let currentCallback = loaderCallbacks.shift()
          while (currentCallback) {
            currentCallback.fn.call(currentCallback.context)
            currentCallback = loaderCallbacks.shift()
          }
        }
      }
    }

    // Load AMD loader if necessary
    if (context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__) {
      // We need to avoid loading multiple loader.js when there are multiple editors loading concurrently
      //  delay to call callbacks except the first one
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ = context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__ || []
      context.__REACT_MONACO_EDITOR_LOADER_CALLBACKS__.push({
        context: this,
        fn: onGotAmdLoader
      })
    } else {
      if (typeof context.require === 'undefined') {
        const loaderScript = context.document.createElement('script')
        loaderScript.type = 'text/javascript'
        loaderScript.src = loaderUrl
        loaderScript.addEventListener('load', onGotAmdLoader)
        context.document.body.appendChild(loaderScript)
        context.__REACT_MONACO_EDITOR_LOADER_ISPENDING__ = true
      } else {
        onGotAmdLoader()
      }
    }
  }

  addKeybindings (editor, monaco) {
    const { keybindings } = this.props
    this.keybindings = Object.keys(keybindings).map(keycode => {
      return editor.addCommand(keycode, keybindings[keycode])
    })
  }

  getModuleTokens (editor) {
    function getTokensAtLine(model, lineNumber) {
      model.getLineTokens(lineNumber, /*inaccurateTokensAcceptable*/false)
      if (!model._lines[lineNumber - 1].getState()) return []
      const freshState = model._lines[lineNumber - 1].getState().clone()
      return model._tokenizationSupport.tokenize(model.getLineContent(lineNumber), freshState, 0).tokens
    }

    function addLineDecorations (editor, tokenStart, tokenEnd) {
      const getSpecialTokensAnLine = (name, line) => getTokensAtLine(editor.model, line).filter(t => t.type === name + '.js')
      const lines = editor.model.getLineCount()
      for (let i = 1; i <= lines; i++) {
        const decorations = editor.getLineDecorations(i)
        const startTokens = getSpecialTokensAnLine(tokenStart, i)
        const endTokens = getSpecialTokensAnLine(tokenEnd, i)
        if (!startTokens || !endTokens) return
        const tokens = _.zip(startTokens, endTokens)
        for (let pair of tokens) {
          if (!pair[1] || !pair[0]) return
          const range = new window.monaco.Range(i, pair[0].offset + 1, i, pair[1].offset + 1)
          const dec = decorations.filter(dec => _.isEqual(dec.range, range))
          if (dec && dec.length === 1) {
            // do nothing, we already have decoration here, yay
          } else if (dec && dec.length > 1) {
            // remove useless decorations and set only one
            editor.deltaDecorations(dec, [{ range: new window.monaco.Range(1,1,1,1), options : { } }])
            editor.deltaDecorations([], [{range: range, options: {inlineClassName: 'editor-npm-module'}}])
          } else {
            // no decorations on current module, add some
            editor.deltaDecorations([], [{range: range, options: {inlineClassName: 'editor-npm-module'}}])
          }
        }
      }
      return
    }

    addLineDecorations(editor, 'module', 'moduleEnd')
  }

  initMonaco () {
    const value = this.props.value !== null ? this.props.value : this.props.defaultValue
    const { language, theme, options, onMouseDown } = this.props
    const containerElement = this.container
    const context = this.props.context || window
    if (typeof context.monaco !== 'undefined') {
      // Before initializing monaco editor
      this.editorWillMount(context.monaco)
      this.editor = context.monaco.editor.create(containerElement, {
        value,
        language,
        theme,
        ...options
      })
      // After initializing monaco editor
      this.editorDidMount(this.editor, context.monaco)

      // keybindings
      this.addKeybindings(this.editor, context.monaco)

      if (onMouseDown) {
        this.editor.onMouseDown(function (e) {
          onMouseDown()
        })
      }

      this.setSize()

      // @TODO: find how to make it clickable
      // this.editor.deltaDecorations([], [
      //   {
      //     // range: start line, start column, end line, end column
      //     range: new context.monaco.Range(1,19,1,21),
      //     options: {
      //       inlineClassName: 'editor-npm-module',
      //       hoverMessage: 'View module documentation',
      //     }
      //   },
      // ])

      this.addDocumentationButton(this.editor)
    }
  }

  destroyMonaco () {
    if (typeof this.editor !== 'undefined') {
      this.editor.dispose()
    }
  }

  setSize = (w, h) => {
    if (this.editor) {
      const width = w ? w + 'px' : '100%'
      const height = h ? h + 'px' : '100%'
      this.container.style.width = width
      this.container.style.height = height

      this.editor.layout()
    }
  }

  setRef = (div) => {
    this.container = div
  }

  render () {
    const { width, height, className } = this.props
    const fixedWidth = width.toString().indexOf('%') !== -1 ? width : `${width}px`
    const fixedHeight = height.toString().indexOf('%') !== -1 ? height : `${height}px`
    const style = {
      width: fixedWidth,
      height: fixedHeight
    }
    return (
      <div ref={this.setRef} style={style} className={cx(monacoEditorContainer, className)} />
    )
  }
}

MonacoEditor.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  options: PropTypes.object,
  editorDidMount: PropTypes.func,
  editorWillMount: PropTypes.func,
  onChange: PropTypes.func,
  requireConfig: PropTypes.object,
  context: PropTypes.object,
  keybindings: PropTypes.object,
  onMouseDown: PropTypes.func,
  className: PropTypes.string
}

MonacoEditor.defaultProps = {
  width: '100%',
  height: '100%',
  value: null,
  defaultValue: '',
  language: 'javascript',
  theme: 'UnitClusterTheme',
  options: {},
  editorDidMount: noop,
  editorWillMount: noop,
  onChange: noop,
  requireConfig: {}
}

export default MonacoEditor
