import { getSuggestions } from './search'

import db from '../../providers/dexie'

export const getSearchSuggestions = getSuggestions({ db })
export { suggestionsTypes } from './search'
