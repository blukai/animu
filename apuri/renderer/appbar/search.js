import React from 'react'

import Autocomplete from '../components/autocomplete'

const Search = () => (
  <Autocomplete placeholder="Anime Search" suggestions={() => ['yay', 'nay']} />
)

export default Search
