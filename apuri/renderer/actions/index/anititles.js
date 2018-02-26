import gql from 'graphql-tag'

// get_all gets the dump of anime titles
export const get_all = ({ fetch, config: { S3_URL, S3_BUCKET } }) => () =>
  fetch(`${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`).then(res => res.json())

// get_new gets only ones which id is higher than given
export const get_new = ({ client }) => afterId => {
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
        id: afterId
      }
    })
    .then(res => res.data.anititles)
}

// ----

// get_last get the last item from db,
// if there is nothing, it'll return undefined
export const get_last = ({ db }) => () => db.anititles.toCollection().last()

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

export const shouldUpdate = ({ localStorage }) => () => {
  const updatedAt = localStorage.getItem('index_updated_at')
  if (!updatedAt || Math.abs(updatedAt - new Date().getTime()) / 36e5 > 24) {
    return true
  }
  return false
}

export const setUpdateTime = ({ localStorage }) => (
  time = new Date().getTime()
) => {
  localStorage.setItem('index_updated_at', time)
}

// ----

export const types = {
  loading: 'index : update : loading',
  ok: 'index : update : ok',
  error: 'index : update : error'
}

export const update = ({
  db,
  fetch,
  config,
  client,
  localStorage
}) => async dispatch => {
  try {
    dispatch({ type: types.loading })

    const last = await get_last({ db })()
    if (shouldUpdate({ localStorage })() || last === undefined) {
      let at = []
      if (last === undefined) {
        at = await get_all({ fetch, config })()
      } else {
        at = await get_new({ client })(last.id)
      }
      db.anititles.bulkPut(transform(at))
      setUpdateTime({ localStorage })()
    }

    dispatch({ type: types.ok })
  } catch (err) {
    dispatch({ type: types.error, payload: err })
  }
}
