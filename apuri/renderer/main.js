import React from 'react'
import { render } from 'react-dom'

import { Provider } from 'mobx-react'
import { HashRouter } from 'react-router-dom'

import { injectGlobal } from 'styled-components'

import stores from './stores'

import App from './app'

// ----

const { NODE_ENV } = process.env

if (NODE_ENV !== 'production') {
  const { whyDidYouUpdate } = require('why-did-you-update')
  whyDidYouUpdate(React)
}

// ----

injectGlobal`
  html, body, #react-root {
    height: 100%;
    overflow: hidden;
  }

  body {
    margin: 0;
  }
`

// ----

render(
  <HashRouter>
    <Provider {...stores}>
      <App />
    </Provider>
  </HashRouter>,
  document.getElementById('react-root')
)

if (module.hot) {
  module.hot.accept()
}
