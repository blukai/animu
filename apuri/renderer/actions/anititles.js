const types = {
  LOADING: 'anititles/LOADING',
  OK: 'anititles/OK',
  ERROR: 'anititles/ERROR'
}

export const get = (lastId = 0) => dispatch => {
  dispatch({ type: types.OK })
}

export const reducer = (
  state = { loading: false, error: false, data: [] },
  { type, payload }
) => {
  switch (type) {
    case types.LOADING:
      return {
        ...state,
        loading: true
      }
    case types.OK:
      return {
        ...state,
        loading: false,
        data: payload
      }
    case types.ERROR:
      return {
        ...state,
        loading: false,
        error: true
      }
    default:
      return state
  }
}
