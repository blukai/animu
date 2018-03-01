import React, { Component } from 'react'
import { func, shape, bool } from 'prop-types'
import { hot } from 'react-hot-loader'

import { connect } from 'react-redux'

import Container from './components/container'
import Appbar from './appbar'

import updateIndex from './actions/index'

class App extends Component {
  static propTypes = {
    updateIndex: func.isRequired,
    index: shape({
      loading: bool.isRequired,
      error: bool.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.props.updateIndex()
  }

  render() {
    const { index } = this.props

    return (
      <Container error={index.error} loading={index.loading}>
        <Appbar />
        <h1>Hellow</h1>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  index: state.index
})

const mapDispatchToProps = dispatch => ({
  updateIndex: () => {
    dispatch(updateIndex)
  }
})

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(App))
