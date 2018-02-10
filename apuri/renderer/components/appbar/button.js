import React, { Component } from 'react'
import { object } from 'prop-types'

import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'

import { inputHeight } from './search'

const styles = theme => ({
  root: {
    fontSize: 20,
    height: inputHeight,
    width: inputHeight,
    margin: 0
  }
})

@withStyles(styles)
class Button extends Component {
  static propTypes = {
    classes: object.isRequired
  }

  render() {
    const { classes, children, ...other } = this.props

    return (
      <IconButton {...other} classes={{ root: classes.root }}>
        {children}
      </IconButton>
    )
  }
}

export default Button
