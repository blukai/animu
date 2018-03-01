import React from 'react'
import { render } from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { MuiThemeProvider } from 'material-ui/styles'

import Reboot from 'material-ui/Reboot'

import store from './providers/redux'
import client from './providers/apollo'
import theme from './providers/mui'

import App from './app'

render(
  <ReduxProvider store={store}>
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <Reboot />
        <App />
      </MuiThemeProvider>
    </ApolloProvider>
  </ReduxProvider>,
  document.getElementById('react-root')
)
