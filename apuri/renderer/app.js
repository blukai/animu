import React, { Component } from 'react'
import { object } from 'prop-types'
import { inject } from 'mobx-react'
import { withStyles } from 'material-ui/styles'

// ----

const styles = theme => ({
  '@global': {
    body: {
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
      ], //theme.typography.fontFamily
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
@inject('dexie')
class App extends Component {
  static propTypes = {
    classes: object.isRequired,
    dexie: object.isRequired
  }

  state = {
    loading: false,
    error: null
  }

  async componentDidMount() {
    try {
      this.setState({ loading: true })

      const isAnimeDBEmpty = await this.isAnimeDBEmpty()
      if (isAnimeDBEmpty) {
        const at = await this.fetchAnimeTitles()
        await this.storeAnimeTitles(at)
      }
    } catch (error) {
      this.setState({ error })
    } finally {
      this.setState({ loading: false })
    }
  }

  isAnimeDBEmpty = () =>
    new Promise((resolve, reject) => {
      this.props.dexie.anime
        .count()
        .then(res => {
          resolve(res === 0)
        })
        .catch(err => {
          reject(err)
        })
    })

  fetchAnimeTitles = () =>
    new Promise((resolve, reject) => {
      fetch(`${BUCKET_URL}/anime-titles.json`)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err)
        })
    })

  storeAnimeTitles = at =>
    new Promise((resolve, reject) => {
      const items = at.slice().reduce((prev, { id, titles }) => {
        return (prev || []).concat({
          id,
          titles: titles.reduce((prev, { text }) => {
            return (prev || []).concat(text)
          }, [])
        })
      }, [])

      this.props.dexie.anime
        .bulkAdd(items)
        .then(() => {
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })

  render() {
    const { error, loading } = this.state

    return error ? (
      error.message || 'something went wrong'
    ) : loading ? (
      'LOADING'
    ) : (
      <>'🌚'</>
    )
  }
}

export default App
