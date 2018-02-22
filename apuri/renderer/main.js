import React from 'react'
import { render } from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'

import store from './store'
import client from './client'

import App from './app'

render(
  <ReduxProvider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </ReduxProvider>,
  document.getElementById('react-root')
)
