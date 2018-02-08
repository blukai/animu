import React, { Component } from 'react'
import { object } from 'prop-types'

import { withStyles } from 'material-ui/styles'
import Input, { InputAdornment } from 'material-ui/Input'
import SearchIcon from 'material-ui-icons/Search'
import ClearIcon from 'material-ui-icons/Clear'

import Button from './button'

const styles = theme => ({
  inputRoot: {
    '&:before, &:after': {
      content: 'none'
    },

    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: 13,
    height: 30
  },

  inputAdornmentRoot: {
    maxHeight: 'none'
  }
})

@withStyles(styles)
class Search extends Component {
  static propTypes = {
    classes: object.isRequired
  }

  input = null

  state = {
    value: '',
    focused: false
  }

  preventFocusLose = () => {
    this.input.focus()
  }

  handleChange = event => {
    this.setState({ value: event.target.value })
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

  clear = () => {
    this.setState({ value: '' })
  }

  render() {
    const { classes } = this.props

    return (
      <Input
        classes={{ root: classes.inputRoot }}
        placeholder="Search"
        value={this.state.value}
        inputRef={input => {
          this.input = input
        }}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        startAdornment={
          <InputAdornment classes={{ root: classes.inputAdornmentRoot }}>
            <Button
              classes={{ root: this.props.classes.buttonRoot }}
              onClick={this.preventFocusLose}
            >
              <SearchIcon color={this.state.focused ? 'inherit' : 'disabled'} />
            </Button>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment
            classes={{ root: classes.inputAdornmentRoot }}
            onClick={this.preventFocusLose}
          >
            <Button
              classes={{ root: this.props.classes.buttonRoot }}
              disabled={this.state.value.length === 0}
              onClick={this.clear}
            >
              {this.state.value && <ClearIcon />}
            </Button>
          </InputAdornment>
        }
      />
    )
  }
}

export default Search
