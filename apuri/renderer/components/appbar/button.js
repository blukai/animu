import React, { Component } from 'react'
import { object, func, bool } from 'prop-types'

import { withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'

const styles = theme => ({
  root: {
    fontSize: 20,
    height: 24,
    width: 24,
    margin: `0 ${theme.spacing.unit}px`
  }
})

@withStyles(styles)
class Button extends Component {
  static propTypes = {
    classes: object.isRequired,
    onClick: func,
    disabled: bool
  }

  static defaultProps = {
    onClick() {},
    disabled: false
  }

  render() {
    const { classes, onClick, disabled, children } = this.props

    return (
      <IconButton
        classes={{ root: classes.root }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </IconButton>
    )
  }
}

export default Button
