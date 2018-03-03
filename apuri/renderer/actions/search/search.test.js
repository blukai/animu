import { getSuggestions, clearSuggestions, suggestionsTypes } from './search'

describe('search actions', () => {
  describe('getSuggestions', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    it('works', () => {
      const data = [
        {
          id: 666,
          titles: ['No Game No Life', '노 게임 노 라이프']
        },
        {
          id: 999,
          titles: ['No Game No Life Zero', '', 'ノーゲーム・ノーライフ ゼロ']
        }
      ]

      const limit = jest.fn()
      limit.mockReturnValueOnce({
        toArray: () => Promise.resolve(data)
      })
      const startsWithIgnoreCase = jest.fn()
      startsWithIgnoreCase.mockReturnValueOnce({
        limit
      })
      const where = jest.fn()
      where.mockReturnValueOnce({
        startsWithIgnoreCase
      })
      const db = {
        anititles: { where }
      }

      const query = 'no game no life'
      return store.dispatch(getSuggestions({ db })(query)).then(() => {
        const actions = store.getActions()
        const [loading, ok] = actions

        expect(loading).toEqual({ type: suggestionsTypes.loading })
        expect(ok).toEqual({ type: suggestionsTypes.ok, payload: data })

        expect(where).toHaveBeenCalledWith('titles')
        expect(startsWithIgnoreCase).toHaveBeenCalledWith(query)
        expect(limit).toHaveBeenCalledWith(10)
      })
    })
  })

  describe('clearSuggestions', () => {
    let store
    beforeEach(() => {
      store = mockStore({})
    })

    it('works', () => {
      store.dispatch(clearSuggestions())

      const actions = store.getActions()
      const [clear] = actions
      expect(clear).toEqual({ type: suggestionsTypes.clear })
    })
  })
})
