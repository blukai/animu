import React, { Component } from 'react'
import { object } from 'prop-types'

class Search extends Component {
  static propTypes = {
    match: object.isRequired
  }

  render() {
    const { match } = this.props

    // TODO
    // I guess it will be backend dependent,
    // it should be good'ish search what considers string metrics and other stuff

    return `search query ${match.params.query}`
  }
}

export default Search
