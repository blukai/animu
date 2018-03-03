export const suggestionsTypes = {
  loading: 'search : getSuggestions : loading',
  ok: 'search : getSuggestions : ok',
  error: 'search : getSuggestions : error',
  clear: 'search : getSuggestions : clear'
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
      .then(items =>
        // remove duplicates
        Promise.resolve(
          items.reduce(
            (prev, item) =>
              prev.find(({ id }) => id === item.id) ? prev : prev.concat(item),
            []
          )
        )
      )

    dispatch({ type: suggestionsTypes.ok, payload: items })
  } catch (err) {
    dispatch({ type: suggestionsTypes.error, payload: err })
  }
}

export const clearSuggestions = () => dispatch => {
  dispatch({ type: suggestionsTypes.clear })
}
