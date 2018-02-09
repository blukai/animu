import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'mobx-react'
import { HashRouter } from 'react-router-dom'

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'
import grey from 'material-ui/colors/grey'

import stores from './stores'

import App from './app'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#000'
    },
    background: {
      default: '#191c20',
      paper: '#24292e'
    }
  },

  typography: {
    fontFamily: [
      'Segoe UI',
      '-apple-system',
      'BlinkMacSystemFont',
      'Helvetica',
      'Arial',
      'sans-serif',
      'Segoe UI Emoji',
      'Segoe UI Symbol',
      'Apple Color Emoji'
    ]
  }
})

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
