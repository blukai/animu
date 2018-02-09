import Dexie from 'dexie'

class IndexedDB extends Dexie {
  anime = null

  constructor() {
    super('animu')

    this.version(1).stores({
      anime: 'id, *titles'
    })

    this.anime = this.table('anime')
  }
}

// ----

class Anime extends IndexedDB {
  IsDBEmpty = () =>
    new Promise((resolve, reject) => {
      this.anime
        .count()
        .then(res => {
          resolve(res === 0)
        })
        .catch(err => {
          reject(err)
        })
    })

  // ----

  fetchAnimeTitles = () =>
    new Promise((resolve, reject) => {
      fetch(`${BUCKET_URL}/anime-titles.json`)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err)
        })
    })

  transformAnimeTitles = at =>
    at.slice().reduce((prev, { id, titles }) => {
      return prev.concat({
        id,
        titles: titles.slice().reduce((prev, { type, text }) => {
          const next = prev
          if (type === 'main') {
            prev.unshift(text)
          } else {
            prev.push(text)
          }
          return next
        }, [])
      })
    }, [])

  storeAnimeTitles = at =>
    new Promise((resolve, reject) => {
      this.anime
        .bulkAdd(at)
        .then(() => {
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })

  // combination of fetch, transform and store
  DumpAnimeTitles = async () => {
    try {
      const at = await this.fetchAnimeTitles()
      const transformed = this.transformAnimeTitles(at)
      await this.storeAnimeTitles(transformed)
    } catch (err) {
      console.error(err)
    }
  }

  // ----

  getSearchSuggestions = key =>
    new Promise((resolve, reject) => {
      this.anime
        .where('titles')
        .startsWithIgnoreCase(key)
        .limit(10)
        .toArray()
        .then(items => {
          resolve(
            items.reduce((prev, item) => {
              if (prev.find(({ id }) => id === item.id)) {
                return prev
              }
              return prev.concat(item)
            }, [])
          )
        })
        .catch(err => {
          reject(err)
        })
    })
}

export const anime = new Anime()
