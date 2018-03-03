import React from 'react'

import { hot } from 'react-hot-loader'

const Anime = ({ match }) => {
  return `anime id: ${match.params.id}`
}

export default hot(module)(Anime)
