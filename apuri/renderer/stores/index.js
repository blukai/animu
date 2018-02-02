import App from './app'

import Dexie from 'dexie'

const db = new Dexie('animu')
db.version(1).stores({
  anime: 'id, *titles'
})

export default {
  appStore: new App(db)
}
