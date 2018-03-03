import React, { Component } from 'react'
import { object, func, shape, bool, array } from 'prop-types'

import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Input, { InputAdornment } from 'material-ui/Input'
import Paper from 'material-ui/Paper'
import { ListItem, ListItemText } from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import SearchIcon from 'material-ui-icons/Search'
import ClearIcon from 'material-ui-icons/Clear'

import { getSearchSuggestions } from '../actions/search'

const styles = theme => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '100%'
  },

  input: {
    '&:before, &:after': {
      content: 'none'
    },
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 2,
    padding: '2px 8px'
  },
  inputIcon: {
    width: 20,
    height: 20
  },
  inputButton: {
    width: 20,
    height: 20
  },

  suggestions: {
    position: 'absolute',
    width: '100%',
    top: '100%'
  },
  suggestionItem: {
    padding: `10px 14px`
  },
  suggestionItemTextPrimary: {
    fontSize: 14
  },
  suggestionItemTextSecondary: {
    fontSize: 13,
    fontWeight: theme.typography.fontWeightLight
  }
})

class Search extends Component {
  static propTypes = {
    classes: object.isRequired,
    getSuggestions: func.isRequired,
    suggestions: shape({
      error: bool.isRequired,
      loading: bool.isRequired,
      payload: array.isRequired
    }).isRequired
  }

  // ----

  state = {
    value: '',
    suggestions: [],
    focused: false
  }

  input = null

  // ----

  componentWillUpdate(nextProps) {
    const { payload: prev } = this.props.suggestions
    const { payload: next } = nextProps.suggestions
    if (
      prev.length !== next.length ||
      !prev.every(({ id }, index) => id === next[index].id)
    ) {
      this.transformSuggestions(next)
    }
  }

  // input actions

  clear = () => {
    this.setState({ value: '' })
    this.focus()
  }

  focus = () => {
    if (this.input) {
      this.input.focus()
    }
  }

  blur = () => {
    if (this.input) {
      this.input.blur()
    }
  }

  // input handlers

  handleChange = event => {
    event.preventDefault()
    const { value } = event.target
    this.setState({ value })
    if (this.shouldSuggest()) {
      this.props.getSuggestions(value)
    }
  }

  handleFocus = () => {
    this.setState({ focused: true })
  }

  handleBlur = () => {
    this.setState({ focused: false })
  }

  handleKey = event => {
    const { key } = event
    if (key === 'Escape') {
      this.blur()
    }
  }

  // helpers

  shouldSuggest() {
    const { value } = this.state
    return value && value.length >= 3
  }

  transformSuggestions(suggestions) {
    this.setState({
      suggestions: suggestions.reduce(
        (prev, item) =>
          prev.find(({ id }) => id === item.id)
            ? prev
            : prev.concat({
                id: item.id,
                titles: {
                  main: item.titles[0],
                  official: item.titles[1]
                }
              }),
        []
      )
    })
  }

  // renderers

  renderInput() {
    const { classes } = this.props
    const { value } = this.state

    return (
      <Input
        fullWidth
        value={value}
        placeholder="Anime Search"
        className={classes.input}
        inputRef={input => {
          this.input = input
        }}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onKeyDown={this.handleKey}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon
              className={classes.inputIcon}
              color={this.state.focused ? 'inherit' : 'disabled'}
            />
          </InputAdornment>
        }
        endAdornment={
          value && (
            <InputAdornment position="end">
              <IconButton className={classes.inputButton} onClick={this.clear}>
                <ClearIcon className={classes.inputIcon} />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    )
  }

  renderSuggestions() {
    const { classes, suggestions } = this.props
    const { value } = this.state

    return (
      <Paper square className={classes.suggestions}>
        {this.shouldSuggest() &&
          this.state.focused &&
          this.state.suggestions.map(({ id, titles: { main, official } }) => (
            <ListItem key={id} button className={classes.suggestionItem}>
              <ListItemText
                primary={main}
                secondary={main !== official && official}
                classes={{
                  primary: classes.suggestionItemTextPrimary,
                  secondary: classes.suggestionItemTextSecondary
                }}
              />
            </ListItem>
          ))}
      </Paper>
    )
  }

  // ----

  render() {
    const { classes } = this.props

    return (
      <div className={classes.container}>
        {this.renderInput()}
        {this.renderSuggestions()}
      </div>
    )
  }
}

const mapStateToProps = ({ searchSuggestions }) => ({
  suggestions: searchSuggestions
})

const mapDispatchToProps = dispatch => ({
  getSuggestions: query => {
    dispatch(getSearchSuggestions(query))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withStyles(styles)(Search)
)
