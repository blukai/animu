import { suggestionsTypes } from '../actions/search'

const initialState = { loading: false, error: false, payload: [] }
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case suggestionsTypes.loading:
      return {
        ...state,
        loading: true
      }
    case suggestionsTypes.error:
      return {
        ...state,
        loading: false,
        error: true
      }
    case suggestionsTypes.ok:
      return {
        ...state,
        loading: false,
        payload
      }
    case suggestionsTypes.clear:
      return {
        ...initialState
      }
    default:
      return state
  }
}
