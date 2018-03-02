export const suggestionsTypes = {
  loading: 'search : getSuggestions : loading',
  ok: 'search : getSuggestions : ok',
  error: 'search : getSuggestions : error'
}

export const getSuggestions = ({ db }) => (
  query,
  limit = 10
) => async dispatch => {
  try {
    dispatch({ type: suggestionsTypes.loading })

    const items = await db.anititles
      .where('titles')
      .startsWithIgnoreCase(query)
      .limit(limit)
      .toArray()

    dispatch({ type: suggestionsTypes.ok, payload: items })
  } catch (err) {
    dispatch({ type: suggestionsTypes.error, payload: err })
  }
}
