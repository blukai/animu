import React, { Component } from 'react'
import { object } from 'prop-types'

class Search extends Component {
  static propTypes = {
    match: object.isRequired
  }

  render() {
    const { match } = this.props

    return `search query ${match.params.query}`
  }
}

export default Search
