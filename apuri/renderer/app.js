import React, { Component } from 'react'
import { object } from 'prop-types'
import { inject } from 'mobx-react'
import { withStyles } from 'material-ui/styles'
import { Switch, Route } from 'react-router-dom'

import Container from './components/container'
import Appbar from './components/appbar'

import Anime from './pages/anime'
import Search from './pages/search'

// ----

const styles = theme => ({
  '@global': {
    body: {
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.fontSize,
      color: theme.palette.text.primary
    },

    'html, body, #root': {
      height: '100%',
      width: '100%'
    }
  }
})

// ----

@withStyles(styles)
@inject('anime')
class App extends Component {
  static propTypes = {
    classes: object.isRequired,
    anime: object.isRequired
  }

  state = {
    loading: false,
    error: null
  }

  async componentWillMount() {
    try {
      this.setState({ loading: true })
      const { anime } = this.props
      const isAnimeDBEmpty = await anime.isDBEmpty()
      if (isAnimeDBEmpty) {
        const at = await anime.fetchTitles()
        const tfd = anime.transformTitles(at)
        await anime.saveTitles(tfd)
      }
    } catch (error) {
      this.setState({ error })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    return (
      <Container loading={this.state.loading} error={this.state.error}>
        <Appbar />
        <Switch>
          <Route exact path="/" render={() => '🌚'} />
          <Route exact path="/anime/:id" component={Anime} />
          <Route path="/search/:query" component={Search} />
          <Route path="*" render={() => 'FourOhFour'} />
        </Switch>
      </Container>
    )
  }
}

export default App
