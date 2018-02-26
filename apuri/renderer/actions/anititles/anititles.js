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

// ----

// transform transforms the array of anime titiles
// to match db schema.
// titles array has reserved indexes.
export const transform = anititles =>
  anititles.map(({ id, titles }) => ({
    id,
    titles: titles.reduce(
      (prev, { lang, type, text }) => {
        const next = prev.slice()
        if (lang === 'x-jat' && type === 'main') {
          next[0] = text
        } else if (lang === 'en' && type === 'official') {
          next[1] = text
        } else {
          next.push(text)
        }
        return next
      },
      [/* x-jat main */ '', /* en official */ '']
    )
  }))

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
    const transformed = transform(at)
    db.bulkPut(transformed)

    dispatch({ type: types.ok })
  } catch (err) {
    dispatch({ type: types.error, payload: err })
  }
}
