import { remote } from 'electron'

class Win {
  win = remote.getCurrentWindow()

  minimize = () => {
    this.win.minimize()
  }

  zoom = () => {
    if (this.win.isMaximized()) {
      this.win.unmaximize()
    } else {
      this.win.maximize()
    }
  }

  close = () => {
    this.win.close()
  }
}

export default new Win()
