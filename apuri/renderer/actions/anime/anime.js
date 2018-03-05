export const titleTypes = {
  loading: 'anime : getTitle : loading',
  error: 'anime : getTitle : error',
  ok: 'anime : getTitle : ok'
}

export const getTitle = ({ db }) => id => async dispatch => {
  try {
    dispatch({ type: titleTypes.loading })

    const title = await db.anititles.get(Number(id))

    dispatch({ type: titleTypes.ok, payload: title })
  } catch (err) {
    dispatch({ type: titleTypes.error, payload: err })
  }
}
