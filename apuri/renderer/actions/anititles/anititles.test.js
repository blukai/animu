import gql from 'graphql-tag'

import { getAll, getNew, getLast } from './anititles'

describe('anititles', () => {
  describe('getAll', () => {
    test('should work', () => {
      const result = [{ id: 12345, titles: [] }]

      const fetch = jest.fn()
      fetch.mockReturnValueOnce(
        Promise.resolve({
          json: () => Promise.resolve(result)
        })
      )
      const config = {
        S3_URL: 'https://s3.aws',
        S3_BUCKET: 'secrit'
      }

      return getAll({ fetch, config })().then(res => {
        const { S3_URL, S3_BUCKET } = config
        expect(fetch).toHaveBeenCalledWith(
          `${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`
        )

        expect(res).toEqual(result)
      })
    })
  })

  // ----

  describe('getNew', () => {
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
      client.query.mockReturnValueOnce(Promise.resolve(result))

      return getNew({ client })(12344).then(res => {
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

  describe('getLast', () => {
    test('should work', () => {
      const db = {
        toCollection: () => ({
          last: () => Promise.resolve(undefined)
        })
      }

      return getLast({ db })().then(item => {
        console.log(item)
      })
    })
  })
})
