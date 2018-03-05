import { combineReducers } from 'redux'

import anititles from './anititles'
import searchSuggestions from './search'
import animeTitle from './anime'

export default combineReducers({
  anititles,
  searchSuggestions,
  animeTitle
})
