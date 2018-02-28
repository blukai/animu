import React from 'react'
import { render } from 'react-dom'
// redux
import { Provider as ReduxProvider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
// apollo
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// material-ui
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Reboot from 'material-ui/Reboot'

import reducers from './reducers'
import config from '../config'

import App from './app'

// ----

const middlewares = [thunk, logger]
const store = createStore(reducers, applyMiddleware(...middlewares))

// ----

const client = new ApolloClient({
  link: new HttpLink({
    uri: `${config.API_URL}/${process.env.NODE_ENV}/graphql`
  }),
  cache: new InMemoryCache()
})

// ----

const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
})

// ----

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
