import gql from 'graphql-tag'

// getAll gets dump of anime titles
export const getAll = ({ fetch, config: { S3_URL, S3_BUCKET } }) => () =>
  fetch(`${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`).then(res => res.json())

// newNew gets only ones which id is higher than given
export const getNew = ({ client }) => aftedID => {
  const query = gql`
    query getNewAnititles($id: Int!) {
      anititles(afterID: $id) {
        id
        titles {
          type
          lang
          text
        }
      }
    }
  `

  return client
    .query({
      query,
      variables: {
        id: aftedID
      }
    })
    .then(res => res.data.anititles)
}

// getLast get the last item, otherwise if no anime
// found in the table, it'll return undefined
export const getLast = ({ db }) => () => db.toCollection().last()

// TODO: transform anititles

// ----

export const types = {
  loading: 'anititles : checkout : loading',
  ok: 'anititles : checkout : ok',
  error: 'anititles : checkout : error'
}

export const checkout = ({ db, fetch, config, client }) => async dispatch => {
  try {
    dispatch({ type: types.loading })

    let at = []
    const last = await getLast({ db })()
    if (last === undefined) {
      at = await getAll({ fetch, config })()
    } else {
      at = await getNew({ client })(last.id)
    }
    db.bulkPut(at)

    dispatch({ type: types.ok })
  } catch (err) {
    dispatch({ type: types.error, payload: err })
  }
}
