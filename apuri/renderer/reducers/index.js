import { combineReducers } from 'redux'

import anititles from './anititles'
import searchSuggestions from './search'

export default combineReducers({
  anititles,
  searchSuggestions
})
