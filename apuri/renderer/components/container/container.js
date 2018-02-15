import React, { Component } from 'react'
import { bool, object, node } from 'prop-types'

class Container extends Component {
  static propTypes = {
    loading: bool.isRequired,
    error: object,
    children: node
  }

  static defaultProps = {
    error: null,
    children: null
  }

  render() {
    if (this.props.error) {
      return this.props.error.message
    }

    if (this.props.loading) {
      return 'loading..'
    }

    return this.props.children
  }
}

export default Container
