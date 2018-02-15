import React, { Component } from 'react'
import { object } from 'prop-types'

import { inject } from 'mobx-react'

import Container from '../../components/container'

import { objectizeTitles } from '../../helpers'

@inject('anime')
class Anime extends Component {
  static propTypes = {
    match: object.isRequired,
    anime: object.isRequired
  }

  // ----

  state = {
    loading: false,
    error: null,
    titles: {}
  }

  // ----

  componentDidMount() {
    this.getData(this.props.match.params.id)
  }

  componentWillUpdate(nextProps) {
    const { id } = nextProps.match.params
    if (this.props.match.params.id !== id) {
      this.getData(id)
    }
  }

  // ----

  getData = async id => {
    try {
      this.setState({ loading: true })
      const titles = await this.props.anime.getTitles(id)
      this.setState({ titles: objectizeTitles(titles.titles) })
    } catch (error) {
      this.setState({ error })
    } finally {
      this.setState({ loading: false })
    }
  }

  // ----

  render() {
    const { loading, error, titles } = this.state

    return (
      <Container loading={loading} error={error}>
        {titles.main}
      </Container>
    )
  }
}

export default Anime
