import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import CopyToClipboard from 'react-copy-to-clipboard'

import { css } from 'emotion'
import config from '../utils/css.config'
import cx from 'classnames'

import MonacoEditor from '../lib/MonacoEditor'
import { sleep } from '../utils'

import { LinkIcon } from '../ui/Icons'

// const requireConfig = {
//   url: 'http://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.1/require.min.js',
//   paths: {
//     'vs': 'http://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.10.1/min/vs'
//   }
// }

const flexGrow = css`
  flex: 1 1 auto;
  order: 0;
  align-self: stretch;
  box-sizing: border-box;
  position: relative;
`
const urlCss = css`
  width: 100%;
  padding: 5px 15px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0px;
  z-index: 5;
  background-color: ${config.main_background};
  border-top: 1px solid #eee;
  font-size: 96%;

  & a {
    color: ${config.link_color};
    padding: 0 5px;
    &:hover {
      color: ${config.link_hover};
    }
  }
`
const copy = css`
  color: ${config.muted_text};
  &:hover {
    color: ${config.link_hover};
    cursor: pointer;
  }
`
const saved = css`
  color: ${config.muted_text};
  position: relative;
  float: right;
`
const hidden = css`
  display: none;
`
const clear = css`
  clear: both;
`
const linkIcon = css`
  padding-right: 3px;
  margin-bottom: -2px;
`
const nameCss = css`
  font-size: ${config.base_font_size};
  line-height: 100%;
  color: ${config.muted_text};
  opacity: 1.00;
  padding: 16px;
  margin-left: 30px;
  heght: 26px;
  vertical-align: middle;
`

class Editor extends PureComponent {
  state = {
    urlCopied: false
  }

  editorDidMount = (editor, monaco) => {
    editor.focus()
  }

  onChangeCode = (newValue, e) => {
    this.props.onChange({ code: newValue })
  }

  run = () => {
    this.props.run()
  }

  save = () => {
    this.props.save()
  }

  onCopyUrl = async () => {
    this.setState({
      urlCopied: true
    })
    await sleep(4000)
    this.setState({
      urlCopied: false
    })
  }

  onMouseDown = () => {
    const { onEditorClick } = this.props

    if (onEditorClick) {
      onEditorClick()
    }
  }

  render () {
    const { unit, deploymentUrl, isUnitSaving, onModuleClick } = this.props
    const { urlCopied } = this.state
    const { editorFontSize, editorFontFamily, requireUrl, monacoUrl } = this.context

    const keybindings = {
      [2048 | 49]: this.save, // Ctrl+S
      [2048 | 3]: this.run // Ctrl+Enter
    }

    const requireConfig = {
      url: requireUrl,
      paths: {
        'vs': monacoUrl
      }
    }

    return (
      <div className={flexGrow}>
        <div className={nameCss}>
          {unit.name}
        </div>
        <MonacoEditor
          language='javascript'
          value={unit.code}
          onChange={this.onChangeCode}
          editorDidMount={this.editorDidMount}
          keybindings={keybindings}
          onMouseDown={this.onMouseDown}
          options={{fontSize: editorFontSize, fontFamily: editorFontFamily}}
          onModuleClick={onModuleClick}
          requireConfig={requireConfig}
        />
        <div className={urlCss}>
          <a href={deploymentUrl} target='_blank' rel='noopener noreferrer'>
            <LinkIcon className={linkIcon} />
            {deploymentUrl}
          </a>
          <span className={copy}>
            <CopyToClipboard text={deploymentUrl + '?key=' + localStorage.getItem('devslabToken')}
              onCopy={this.onCopyUrl}>
              <span>
                { urlCopied
                  ? 'copied'
                  : 'copy'
                }
              </span>
            </CopyToClipboard>
          </span>
          <span className={cx(saved, {[hidden]: !isUnitSaving})}>Saving...</span>
          <div className={clear} />
        </div>
      </div>
    )
  }
}

Editor.contextTypes = {
  editorFontSize: PropTypes.string,
  editorFontFamily: PropTypes.string,
  requireUrl: PropTypes.string,
  monacoUrl: PropTypes.string
}

Editor.propTypes = {
  unit: PropTypes.object,
  deploymentUrl: PropTypes.string,
  isUnitSaving: PropTypes.bool,
  onModuleClick: PropTypes.func,
  onChange: PropTypes.func,
  run: PropTypes.func,
  save: PropTypes.func,
  onEditorClick: PropTypes.func
}

export default Editor
