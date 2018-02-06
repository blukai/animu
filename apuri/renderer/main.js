import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'mobx-react'
import { HashRouter } from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

import stores from './stores'

import App from './app'

// ----

const { NODE_ENV } = process.env

if (NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}

// ----

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    background: {
      default: '#000'
    }
  }
})

// ----

render(
  <HashRouter>
    <Provider {...stores}>
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <App />
      </MuiThemeProvider>
    </Provider>
  </HashRouter>,
  document.getElementById('react-root')
)

if (module.hot) {
  module.hot.accept()
}
