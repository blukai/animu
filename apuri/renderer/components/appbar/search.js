import React, { Component } from 'react'
import { object } from 'prop-types'

import { withStyles } from 'material-ui/styles'
import Input, { InputAdornment } from 'material-ui/Input'
import SearchIcon from 'material-ui-icons/Search'
import ClearIcon from 'material-ui-icons/Clear'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import { inject } from 'mobx-react'

import Button from './button'
import { styles as appbarStyles } from './appbar'

const styles = theme => ({
  inputRoot: {
    '&:before, &:after': {
      content: 'none'
    },

    backgroundColor: theme.palette.background.default,
    fontSize: 13,
    height: 28
  },

  inputAdornmentRoot: {
    maxHeight: 'none'
  },

  wrapper: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },

  paperRoot: {
    position: 'absolute',
    width: '100%',
    borderRadius: 0,
    top: appbarStyles.appbarRoot.height
  },

  itemRoot: {
    padding: '4px 10px',
    fontSize: 14
  }
})

@withStyles(styles)
@inject('anime')
class Search extends Component {
  static propTypes = {
    classes: object.isRequired,
    anime: object.isRequired
  }

  // ----

  state = {
    value: '',
    focused: false,
    suggestions: []
  }

  // ----

  input = null

  // ----

  preventFocusLose = () => {
    this.input.focus()
  }

  handleChange = async event => {
    const { value: next } = event.target
    const { value: prev } = this.state

    if (next.length > 0) {
      this.setState({ value: next })

      const nt = next.trim()
      if (nt !== prev.trim() && nt.length >= 3) {
        try {
          const suggestions = await this.props.anime.getSearchSuggestions(nt)
          this.setState({ suggestions })
        } catch (err) {
          console.error(err)
        }
      }
    } else {
      this.clear()
    }
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

  clear = () => {
    this.setState({ value: '', suggestions: [] })
  }

  // ----

  render() {
    const { classes } = this.props

    return (
      <div className={classes.wrapper}>
        {/* text field */}
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
                disableRipple
                onClick={this.preventFocusLose}
                style={{ cursor: 'default' }}
              >
                <SearchIcon
                  color={this.state.focused ? 'inherit' : 'disabled'}
                />
              </Button>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment
              classes={{ root: classes.inputAdornmentRoot }}
              onClick={this.preventFocusLose}
            >
              <Button
                disabled={this.state.value.length === 0}
                onClick={this.clear}
              >
                {this.state.value && <ClearIcon />}
              </Button>
            </InputAdornment>
          }
        />
        {/* suggestions */}
        <Paper classes={{ root: classes.paperRoot }}>
          {this.state.value.length !== 0 &&
            this.state.suggestions.slice().map(({ id, titles }) => (
              <MenuItem
                key={id * Math.random()}
                classes={{ root: classes.itemRoot }}
              >
                {id} - {JSON.stringify(titles)}
              </MenuItem>
            ))}
        </Paper>
      </div>
    )
  }
}

export default Search
