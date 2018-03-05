import React, { Component } from 'react'
import { bool, shape, number, arrayOf, string, func, object } from 'prop-types'

import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'

import Typography from 'material-ui/Typography'

import Container from '../../components/container'

import { getTitle } from '../../actions/anime'
import { objectizeTitleArray } from '../../helpers'

class Anime extends Component {
  static propTypes = {
    title: shape({
      error: bool.isRequired,
      loading: bool.isRequired,
      data: shape({ id: number, titles: arrayOf(string) }).isRequired
    }).isRequired,
    getTitle: func.isRequired,
    match: object.isRequired
  }

  // ----

  componentDidMount() {
    const { id } = this.props.match.params
    this.props.getTitle(Number(id))
  }

  componentWillUpdate(nextProps) {
    const prevId = Number(this.props.match.params.id)
    const nextId = Number(nextProps.match.params.id)
    if (prevId !== nextId) {
      this.props.getTitle(nextId)
    }
  }

  // ----

  render() {
    const { title } = this.props
    const { main: mainTitle, official: officialTitle } = objectizeTitleArray(
      title.data.titles
    )

    return (
      <Container error={title.error} loading={title.loading}>
        <Typography variant="headline">{mainTitle}</Typography>
        {officialTitle && (
          <Typography variant="caption">{officialTitle}</Typography>
        )}
      </Container>
    )
  }
}

const mapState = ({ animeTitle }) => {
  const { error, loading, payload } = animeTitle
  return {
    title: {
      error,
      loading,
      data: payload
    }
  }
}

const mapDispatch = dispatch => ({
  getTitle: id => {
    dispatch(getTitle(id))
  }
})

export default hot(module)(connect(mapState, mapDispatch)(Anime))
