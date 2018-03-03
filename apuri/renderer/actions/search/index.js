import { getSuggestions as getSuggestionsX, clearSuggestions } from './search'

import db from '../../providers/dexie'

export { suggestionsTypes, clearSuggestions } from './search'
export const getSuggestions = getSuggestionsX({ db })
