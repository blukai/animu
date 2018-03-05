import { titleTypes } from '../actions/anime'

const initialState = { loading: false, error: false, payload: {} }
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case titleTypes.loading:
      return {
        ...state,
        loading: true
      }
    case titleTypes.error:
      return {
        ...state,
        loading: false,
        error: true
      }
    case titleTypes.ok:
      return {
        ...state,
        loading: false,
        payload
      }
    default:
      return state
  }
}
