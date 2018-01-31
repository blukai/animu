import { observable, computed } from 'mobx'

class App {
  @observable initialized = false
}

const app = new App()

export default app
