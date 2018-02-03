import React, { Component } from 'react'
import { object } from 'prop-types'
import { inject } from 'mobx-react'

@inject('dexie')
class App extends Component {
  static propTypes = {
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

    return (
      <section style={{ textAlign: 'center' }}>
        {error ? (
          error.message || 'something went wrong'
        ) : loading ? (
          'LOADING'
        ) : (
          <section style={{ WebkitAppRegion: 'drag' }}>🌚</section>
        )}
      </section>
    )
  }
}

export default App
