import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

// if we need some default configuration options
let DLconfig = {}

export default {
  config: function (config) {
    DLconfig = config
  },
  widget: {
    new: (config) => {
      return {

        render: (args) => {
          const defaultProps = { themeColor: '#1078ff'  }
          const props = Object.assign(defaultProps, args, config, DLconfig)

          ReactDOM.render(
            <App {...props}
            />, document.querySelector(config.selector)
          )

          registerServiceWorker()
        },

        unmount: () => {
          ReactDOM.unmountComponentAtNode(document.querySelector(config.selector))
        }
      }
    }
  },
  Devslab: App
}
