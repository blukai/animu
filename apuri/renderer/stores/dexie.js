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

export default new IndexedDB()
