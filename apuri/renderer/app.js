import React, { Component } from 'react'
import { func, shape, bool } from 'prop-types'

import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'

import Container from './components/container'
import Appbar from './appbar'

import updateAnititles from './actions/anititles'

class App extends Component {
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
        <Appbar />
        <h1>Hellow</h1>
      </Container>
    )
  }
}

const mapStateToProps = ({ anititles }) => ({ anititles })

const mapDispatchToProps = dispatch => ({
  updateAnititles: () => {
    dispatch(updateAnititles)
  }
})

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(App))
