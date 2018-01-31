import React, { Component } from 'react'
import { object } from 'prop-types'
import Typography from 'typography'
import githubTheme from 'typography-theme-github'
import { injectGlobal } from 'styled-components'
import { inject, observer } from 'mobx-react'

const typography = new Typography(githubTheme)
typography.injectStyles()

injectGlobal`
  html, body, #react-root {
    height: 100%;
    overflow: hidden;
  }

  body {
    margin: 0;
  }
`

@inject('app')
@observer
class App extends Component {
  static propTypes = {
    app: object.isRequired
  }

  render() {
    return <section>🌚</section>
  }
}

export default App
