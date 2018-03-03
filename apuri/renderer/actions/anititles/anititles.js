import gql from 'graphql-tag'

// getAll gets the dump of anime titles
export const getAll = ({ fetch, config: { S3_URL, S3_BUCKET } }) => () =>
  fetch(`${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`).then(res => res.json())

// getNew gets only ones which id is higher than given
export const getNew = ({ client }) => id => {
  const query = gql`
    query($id: Int!) {
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
    .query({ query, variables: { id } })
    .then(res => res.data.anititles)
}

// ----

// getLast get the last item from db,
// if there is nothing, it'll return undefined
export const getLast = ({ db }) => () => db.anititles.toCollection().last()

// ----

export const getUpdateTime = ({ localStorage }) => () =>
  localStorage.getItem('anititlesUpdatedAt')

export const setUpdateTime = ({ localStorage }) => (
  time = new Date().getTime()
) => localStorage.setItem('anititlesUpdatedAt', time)

export const shouldUpdate = ({ localStorage }) => () => {
  const updatedAt = getUpdateTime({ localStorage })()
  return !updatedAt || Math.abs(updatedAt - new Date().getTime()) / 36e5 > 24
}

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
        if (type === 'main') {
          next[0] = text
        } else if (lang === 'en' && type === 'official') {
          next[1] = text
        } else {
          next.push(text)
        }
        return next
      },
      [/* main */ '', /* en official */ '']
    )
  }))

// ----

export const types = {
  loading: 'anititles : update : loading',
  ok: 'anititles : update : ok',
  error: 'anititles : update : error',
  all: 'anititles : update : all',
  new: 'anititles : update : new'
}

export const update = ({
  localStorage,
  db,
  fetch,
  config,
  client
}) => async dispatch => {
  try {
    dispatch({ type: types.loading })

    const last = await getLast({ db })()
    if (shouldUpdate({ localStorage })() || last === undefined) {
      let rawData
      if (last === undefined) {
        dispatch({ type: types.all }) // used only for testing

        rawData = await getAll({ fetch, config })()
      } else {
        dispatch({ type: types.new }) // used only for testing

        rawData = await getNew({ client })(last.id)
      }

      const transformedData = transform(rawData)
      db.anititles.bulkPut(transformedData)
      setUpdateTime({ localStorage })()
    }

    dispatch({ type: types.ok })
  } catch (err) {
    dispatch({ type: types.error, payload: err })
  }
}
