import React from 'react'

import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'

import Search from './search'

const Appbar = () => (
  <AppBar position="static">
    <Toolbar>
      <Search />
    </Toolbar>
  </AppBar>
)

export default Appbar
