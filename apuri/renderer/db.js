import Dexie from 'dexie'

const db = new Dexie('animu')

db.version(1).stores({
  anititles: 'id, *titles'
})

export default db
