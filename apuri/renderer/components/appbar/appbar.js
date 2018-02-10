import React, { Component } from 'react'
import { object } from 'prop-types'

import { withStyles } from 'material-ui/styles'
import MuiAppbar from 'material-ui/AppBar'

import History from './history'
import Search from './search'

export const appbarHeight = 40

const styles = theme => ({
  appbarRoot: {
    flexDirection: 'row',
    alignItems: 'center',
    height: appbarHeight,
    boxShadow: 'none',
    padding: `0 ${theme.spacing.unit / 2}px`
  }
})

@withStyles(styles)
class Appbar extends Component {
  static propTypes = {
    classes: object.isRequired
  }

  render() {
    const { classes } = this.props

    return (
      <MuiAppbar position="static" classes={{ root: classes.appbarRoot }}>
        <History />
        <Search />
      </MuiAppbar>
    )
  }
}

export default Appbar
