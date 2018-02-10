import React, { Component } from 'react'
import { object } from 'prop-types'

class Anime extends Component {
  static propTypes = {
    match: object.isRequired
  }

  render() {
    const { match } = this.props

    return `anime id ${match.params.id}`
  }
}

export default Anime
