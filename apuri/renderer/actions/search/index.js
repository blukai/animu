import {
  getSuggestions as getSuggestionsX,
  clearSuggestions,
  suggestionsTypes
} from './search'

import db from '../../providers/dexie'

export const getSuggestions = getSuggestionsX({ db })
export { suggestionsTypes, clearSuggestions }
