import React from 'react'
import { object } from 'prop-types'

import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

import Search from './search'

const styles = {
  toolbar: {
    height: 48,
    minHeight: 'auto'
  }
}

const Appbar = ({ classes }) => (
  <AppBar position="static">
    <Toolbar classes={{ root: classes.toolbar }}>
      <Search />
    </Toolbar>
  </AppBar>
)

Appbar.propTypes = {
  classes: object.isRequired
}

export default withStyles(styles)(Appbar)
