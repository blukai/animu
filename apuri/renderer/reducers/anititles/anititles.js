import { types } from '../../actions/anititles'

const initialState = { loading: false, error: false }
export default (state = initialState, { type }) => {
  switch (type) {
    case types.loading:
      return {
        ...state,
        loading: true
      }
    case types.error:
      return {
        ...state,
        loading: false,
        error: true
      }
    case types.ok:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
