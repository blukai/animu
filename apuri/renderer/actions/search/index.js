import { getSuggestions } from './search'

import db from '../../db'

export const getSearchSuggestions = getSuggestions({ db })
export { suggestionsTypes } from './search'
