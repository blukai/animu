import React from 'react'

import { hot } from 'react-hot-loader'

const Search = ({ match }) => {
  return `query: ${match.params.query}`
}

export default hot(module)(Search)
