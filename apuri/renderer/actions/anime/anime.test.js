import { getTitle, titleTypes } from './anime'

describe('anime actions', () => {
  describe('get', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    it('works', () => {
      const data = {
        id: 666,
        titles: ['No Game No Life']
      }

      const db = {
        anititles: {
          get: jest.fn()
        }
      }
      db.anititles.get.mockReturnValueOnce(Promise.resolve(data))

      return store.dispatch(getTitle({ db })(data.id)).then(() => {
        const actions = store.getActions()
        const [loading, ok] = actions

        expect(loading).toEqual({ type: titleTypes.loading })
        expect(ok).toEqual({ type: titleTypes.ok, payload: data })
      })
    })
  })
})
