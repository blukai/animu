import React, { Component } from 'react'
import { object } from 'prop-types'
import { inject } from 'mobx-react'
import { withStyles } from 'material-ui/styles'
import Appbar from './components/appbar'

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

  async componentDidMount() {
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
    const { error, loading } = this.state

    return error ? (
      error.message || 'something went wrong'
    ) : loading ? (
      'LOADING'
    ) : (
      <>
        <Appbar />
        🌚
      </>
    )
  }
}

export default App
