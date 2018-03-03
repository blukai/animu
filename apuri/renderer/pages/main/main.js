import React, { Component } from 'react'
import { func, shape, bool } from 'prop-types'

import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'

import Container from '../../components/container'

import updateAnititles from '../../actions/anititles'

class Main extends Component {
  static propTypes = {
    updateAnititles: func.isRequired,
    anititles: shape({
      loading: bool.isRequired,
      error: bool.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.props.updateAnititles()
  }

  render() {
    const { anititles } = this.props

    return (
      <Container error={anititles.error} loading={anititles.loading}>
        🌚
      </Container>
    )
  }
}

const mapState = ({ anititles }) => ({ anititles })

const mapDispatch = dispatch => ({
  updateAnititles: () => {
    dispatch(updateAnititles)
  }
})

export default hot(module)(connect(mapState, mapDispatch)(Main))
