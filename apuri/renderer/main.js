import React from 'react'
import { render } from 'react-dom'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { enableLogging } from 'mobx-logger'
import stores from './stores'
import App from './containers/App'

const { NODE_ENV } = process.env

if (NODE_ENV !== 'production') {
  enableLogging()
}

render(
  <HashRouter>
    <Provider {...stores}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('react-root')
)
