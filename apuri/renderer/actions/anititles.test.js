import { getAll } from './anititles'

describe('anititles', () => {
  describe('getAll', () => {
    test('should work', () => {
      const data = [{ id: 12345, titles: [] }]

      const fetch = jest.fn()
      fetch.mockReturnValueOnce(
        Promise.resolve({
          json: () => Promise.resolve(data)
        })
      )
      const process = {
        env: {
          S3_URL: 'https://s3.aws',
          S3_BUCKET: 'secrit'
        }
      }

      return getAll({ fetch, process })().then(result => {
        const { S3_URL, S3_BUCKET } = process.env
        expect(fetch).toHaveBeenCalledWith(
          `${S3_URL}/${S3_BUCKET}/anime-titles.json.gz`
        )
        expect(result).toEqual(data)
      })
    })
  })
})
