import gql from 'graphql-tag'

import {
  get_all,
  get_new,
  get_last,
  transform,
  update,
  types
} from './anititles'

describe('anititles action', () => {
  // depencency injection

  const config = {
    S3_URL: 'https://s3.aws',
    S3_BUCKET: 'secrit'
  }

  const fetchMock = val =>
    Promise.resolve({
      json: () => Promise.resolve(val)
    })

  const queryMock = val => Promise.resolve(val)

  const dbMock = val => ({
    toCollection: () => ({
      last: () => Promise.resolve(val)
    }),
    bulkPut: items => {
      const len = items.length
      return len > 0 ? items[len - 1] : items
    }
  })

  // ----

  describe('get_all', () => {
    test('should work', () => {
      const result = [{ id: 12345, titles: [] }]

      const fetch = jest.fn()
      fetch.mockReturnValueOnce(fetchMock(result))

      return get_all({ fetch, config })().then(res => {
        const { S3_URL, S3_BUCKET } = config
        expect(fetch).toHaveBeenCalledWith(
          `${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`
        )

        expect(res).toEqual(result)
      })
    })
  })

  // ----

  describe('get_new', () => {
    test('should work', () => {
      const result = {
        data: {
          anititles: [
            {
              id: 12345,
              titles: [
                {
                  type: 'main',
                  lang: 'en',
                  text: 'Kakegurui'
                }
              ]
            }
          ]
        }
      }

      const client = {
        query: jest.fn()
      }
      client.query.mockReturnValueOnce(queryMock(result))

      return get_new({ client })(12344).then(res => {
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
        expect(client.query).toHaveBeenCalledWith({
          query,
          variables: {
            id: 12344
          }
        })

        expect(res).toEqual(result.data.anititles)
      })
    })
  })

  // ----

  describe('get_last', () => {
    test('should work', () => {
      const db = dbMock(undefined)

      return get_last({ db })().then(item => {
        expect(item).toEqual(undefined)
      })
    })
  })

  // ----

  describe('transform', () => {
    test('should work', () => {
      const actual = [
        {
          id: 6327,
          titles: [
            {
              lang: 'x-jat',
              type: 'main',
              text: 'Bakemonogatari'
            },
            {
              lang: 'en',
              type: 'official',
              text: 'Bakemonogatari'
            },
            {
              lang: 'ja',
              type: 'official',
              text: '化物語'
            }
          ]
        }
      ]

      const expected = [
        {
          id: 6327,
          titles: ['Bakemonogatari', 'Bakemonogatari', '化物語']
        }
      ]

      expect(transform(actual)).toEqual(expected)
    })
  })

  // ----

  describe('update', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    test('should get all', () => {
      const db = dbMock(undefined)
      const fetch = jest.fn()
      fetch.mockReturnValueOnce(
        fetchMock([
          {
            id: 12345,
            titles: []
          },
          {
            id: 54321,
            titles: []
          }
        ])
      )

      return store.dispatch(update({ db, fetch, config })).then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual({ type: types.loading })
        expect(actions[1]).toEqual({ type: types.ok })
      })
    })

    // ----

    test('should get new', () => {
      const db = dbMock([
        {
          id: 12345,
          titles: []
        }
      ])

      const client = {
        query: jest.fn()
      }
      client.query.mockReturnValueOnce(
        queryMock({
          data: {
            anititles: [
              {
                id: 99999,
                titles: []
              }
            ]
          }
        })
      )

      return store.dispatch(update({ db, client })).then(() => {
        const actions = store.getActions()
        expect(actions[0]).toEqual({ type: types.loading })
        expect(actions[1]).toEqual({ type: types.ok })
      })
    })
  })
})
