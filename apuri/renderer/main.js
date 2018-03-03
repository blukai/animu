import React from 'react'
import { render } from 'react-dom'

import { Provider as ReduxProvider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
import { HashRouter, Switch, Route } from 'react-router-dom'
import { MuiThemeProvider } from 'material-ui/styles'

import Reboot from 'material-ui/Reboot'

import store from './providers/redux'
import client from './providers/apollo'
import theme from './providers/mui'

import Appbar from './appbar'

import Main from './pages/main'
import Anime from './pages/anime'

render(
  <ReduxProvider store={store}>
    <ApolloProvider client={client}>
      <HashRouter>
        <MuiThemeProvider theme={theme}>
          <Reboot />
          <Appbar />
          <Switch>
            <Route exact path="/" component={Main} />
            <Route path="/anime/:id" component={Anime} />
          </Switch>
        </MuiThemeProvider>
      </HashRouter>
    </ApolloProvider>
  </ReduxProvider>,
  document.getElementById('react-root')
)
