import gql from 'graphql-tag'

import {
  getAll,
  getNew,
  getLast,
  getUpdateTime,
  setUpdateTime,
  shouldUpdate,
  transform,
  update,
  types
} from './anititles'

describe('anititles actions', () => {
  const oldDate = new Date(2018, 0, 1)

  describe('getAll', () => {
    it('works', () => {
      const data = [{ id: 666, titles: [] }]

      const fetch = jest.fn()
      fetch.mockReturnValueOnce(
        Promise.resolve({
          json: () => Promise.resolve(data)
        })
      )

      const config = {
        S3_URL: 'https://s3.aws/',
        S3_BUCKET: 'secrit'
      }

      return getAll({ fetch, config })().then(at => {
        expect(at).toEqual(data)
        expect(fetch).toHaveBeenCalledWith(
          `${config.S3_URL}/${config.S3_BUCKET}/anime-titles.json.gz`
        )
      })
    })
  })

  // ----

  describe('getNew', () => {
    it('works', () => {
      const data = [{ id: 666, titles: [] }]

      const client = {
        query: jest.fn()
      }
      client.query.mockReturnValueOnce(
        Promise.resolve({
          data: {
            anititles: data
          }
        })
      )

      return getNew({ client })(665).then(res => {
        expect(res).toEqual(data)
        expect(client.query).toHaveBeenCalledWith({
          query: gql`
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
          `,
          variables: {
            id: 665
          }
        })
      })
    })
  })

  // ----

  describe('getLast', () => {
    it('works', () => {
      const db = {
        anititles: {
          toCollection: () => ({
            last: () => Promise.resolve(undefined)
          })
        }
      }

      return getLast({ db })().then(item => {
        expect(item).toEqual(undefined)
      })
    })
  })

  // ----

  describe('getUpdateTime', () => {
    it('works', () => {
      const localStorage = {
        getItem: jest.fn()
      }
      localStorage.getItem.mockReturnValueOnce(undefined)

      expect(getUpdateTime({ localStorage })()).toEqual(undefined)
      expect(localStorage.getItem).toHaveBeenCalledWith('anititlesUpdatedAt')
    })
  })

  describe('setUpdateTime', () => {
    it('works', () => {
      const localStorage = {
        setItem: jest.fn()
      }

      const time = new Date()
      setUpdateTime({ localStorage })(time)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'anititlesUpdatedAt',
        time
      )
    })
  })

  describe('shouldUpdate', () => {
    it('should update 1', () => {
      const localStorage = {
        getItem: jest.fn()
      }
      localStorage.getItem.mockReturnValueOnce(null)

      expect(shouldUpdate({ localStorage })()).toEqual(true)
    })

    it('should update 2', () => {
      const localStorage = {
        getItem: jest.fn()
      }
      localStorage.getItem.mockReturnValueOnce(oldDate)

      expect(shouldUpdate({ localStorage })()).toEqual(true)
    })

    it('should not update', () => {
      const localStorage = {
        getItem: jest.fn()
      }
      localStorage.getItem.mockReturnValueOnce(new Date())

      expect(shouldUpdate({ localStorage })()).toEqual(false)
    })
  })

  // ----

  describe('transform', () => {
    it('works', () => {
      const data = [
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

      expect(transform(data)).toEqual([
        { id: 6327, titles: ['Bakemonogatari', 'Bakemonogatari', '化物語'] }
      ])
    })
  })

  // ----

  describe('update', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    it('should get new because off last update time', () => {
      const localStorage = {
        getItem: () => oldDate,
        setItem: () => {}
      }

      const db = {
        anititles: {
          toCollection: () => ({
            last: () => Promise.resolve([{ id: 666, titles: [] }])
          }),
          bulkPut: items => {
            const len = items.length
            return len > 0 ? items[len - 1] : items
          }
        }
      }

      const fetch = () =>
        Promise.resolve({
          json: () => Promise.resolve([])
        })

      const config = {
        S3_URL: 'https://s3.aws/',
        S3_BUCKET: 'secrit'
      }

      const client = {
        query: () => Promise.resolve({ data: { anititles: [] } })
      }

      return store
        .dispatch(update({ localStorage, db, fetch, config, client }))
        .then(() => {
          const actions = store.getActions()
          const [loading, newt, ok] = actions

          expect(loading).toEqual({ type: types.loading })
          expect(newt).toEqual({ type: types.new })
          expect(ok).toEqual({ type: types.ok })
        })
    })

    it('should get all because off no data', () => {
      const localStorage = {
        getItem: () => null,
        setItem: () => {}
      }

      const db = {
        anititles: {
          toCollection: () => ({
            last: () => Promise.resolve(undefined)
          }),
          bulkPut: items => {
            const len = items.length
            return len > 0 ? items[len - 1] : items
          }
        }
      }

      const fetch = () =>
        Promise.resolve({
          json: () => Promise.resolve([])
        })

      const config = {
        S3_URL: 'https://s3.aws/',
        S3_BUCKET: 'secrit'
      }

      return store
        .dispatch(update({ localStorage, db, fetch, config }))
        .then(() => {
          const actions = store.getActions()
          const [loading, all, ok] = actions

          expect(loading).toEqual({ type: types.loading })
          expect(all).toEqual({ type: types.all })
          expect(ok).toEqual({ type: types.ok })
        })
    })
  })
})
