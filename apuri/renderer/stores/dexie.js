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
  isDBEmpty = () =>
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

  fetchTitles = () =>
    new Promise((resolve, reject) => {
      fetch(`${BUCKET_URL}/anime-titles.json`)
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => {
          reject(err)
        })
    })

  transformTitles = at =>
    at.slice().reduce((prev, { id, titles }) => {
      return prev.concat({
        id,
        titles: titles.slice().reduce(
          (prev, { type, lang, text }) => {
            const next = prev
            if (type === 'main') {
              next.splice(0, 1, text)
            } else if (type === 'official' && lang === 'en') {
              next.splice(1, 1, text)
            } else {
              next.push(text)
            }
            return next
          },
          ['' /* x-jat main */, '' /* en official */]
        )
      })
    }, [])

  saveTitles = at =>
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

  // ----

  getSearchSuggestions = query =>
    new Promise((resolve, reject) => {
      this.anime
        .where('titles')
        .startsWithIgnoreCase(query)
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
