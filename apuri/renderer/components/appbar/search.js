import React, { Component } from 'react'
import { object } from 'prop-types'

import Autosuggest from 'react-autosuggest'

import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import SearchIcon from 'material-ui-icons/Search'
import Paper from 'material-ui/Paper'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { InputAdornment } from 'material-ui/Input'

import { inject } from 'mobx-react'

import { withRouter } from 'react-router-dom'

import Button from './button'
import { appbarHeight } from './appbar'

export const inputHeight = 28

const styles = theme => ({
  // autosuggest

  input: {
    '&:before, &:after': {
      content: 'none'
    },

    backgroundColor: theme.palette.background.default,
    borderRadius: 2,
    fontSize: 13,
    height: 28,
    padding: `6px 0`
  },

  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    margin: `0 ${theme.spacing.unit / 2}px`
  },

  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: appbarHeight
  },

  suggestionsList: {
    listStyle: 'none',
    margin: 0,
    padding: 0
  },

  // material ui

  suggestionList: {
    padding: 0
  },

  suggestionItem: {
    padding: `6px ${theme.spacing.unit}px`,
    borderRadius: 2
  },

  suggestionItemSearch: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 0
  },

  suggestionItemHighlighted: {
    backgroundColor: theme.palette.action.selected
  },

  suggestionItemPrimaryText: {
    fontSize: 13
  },

  suggestionItemSecondaryText: {
    fontSize: 12,
    fontWeight: theme.typography.fontWeightLight
  },

  inputAdornment: {
    margin: `0 ${theme.spacing.unit / 2}px`
  },

  inputAdornmentButton: {
    cursor: 'default'
  }
})

// ----

@withRouter
@inject('anime')
@withStyles(styles)
class Search extends Component {
  static propTypes = {
    classes: object.isRequired,
    anime: object.isRequired,
    history: object.isRequired
  }

  // ----

  state = {
    value: '',
    suggestions: [],
    focused: false.className,
    query: ''
  }

  // ----

  renderInput = ({ ref, ...other }) => {
    const { classes } = this.props

    return (
      <TextField
        fullWidth
        inputRef={ref}
        // Properties applied to the native input element.
        inputProps={{
          placeholder: 'Search Anime',
          // focus, blur to control search icon color
          onFocus: () => {
            this.setState({ focused: true })
          },
          onBlur: () => {
            this.setState({ focused: false })
          }
        }}
        // Properties applied to the Input element.
        InputProps={{
          ...other,
          startAdornment: (
            <InputAdornment
              position="start"
              classes={{ root: classes.inputAdornment }}
            >
              <Button disableRipple className={classes.inputAdornmentButton}>
                <SearchIcon
                  color={this.state.focused ? 'inherit' : 'disabled'}
                />
              </Button>
            </InputAdornment>
          )
        }}
      />
    )
  }

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    const { classes } = this.props

    return (
      <Paper {...containerProps} square>
        <List classes={{ root: classes.suggestionList }}>{children}</List>
      </Paper>
    )
  }

  renderSuggestion = ({ id, titles }, { query, isHighlighted }) => {
    // those indexes are reserved by `transformTitles`
    const jpt = titles[0] // japanese transcription
    const eno = titles[1] // english official

    const { classes } = this.props

    return (
      <ListItem
        key={id}
        button
        classes={{ root: classes.suggestionItem }}
        className={`${isHighlighted ? classes.suggestionItemHighlighted : ''} ${
          id === 0 ? classes.suggestionItemSearch : ''
        }`}
      >
        <ListItemText
          classes={{
            primary: classes.suggestionItemPrimaryText,
            secondary: classes.suggestionItemSecondaryText
          }}
          primary={jpt || `Search for "${query}"`}
          secondary={eno}
        />
      </ListItem>
    )
  }

  // ----

  getSuggestionValue = ({ titles }) => titles[0] || this.state.query

  handleSuggestionsFetchRequested = async ({ value }) => {
    const { anime } = this.props

    try {
      const suggestions = await anime.getSearchSuggestions(value.trim())

      suggestions.unshift({
        id: 0,
        titles: []
      })

      this.setState(({ query }) => {
        const newState = { suggestions }
        // this is important to handle the value of the first item,
        // that represents a search query, in suggestion list
        if (query !== value) {
          newState.query = value
        }
        return newState
      })
    } catch (err) {
      console.error(err)
    }
  }

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  handleChange = (event, { newValue: value }) => {
    this.setState({ value })
  }

  handleSuggestionSelected = (event, { suggestion: { id }, method }) => {
    if (method === 'enter' || method === 'click') {
      const { history } = this.props
      const { pathname: from } = history.location
      const to = id === 0 ? `/search/${this.state.query}` : `/anime/${id}`
      if (to !== from) {
        history.push(to)
      }
    }
  }

  // ----

  render() {
    const { classes } = this.props

    return (
      <Autosuggest
        theme={{
          input: classes.input,
          container: classes.container,
          suggestionsContainer: classes.suggestionsContainer,
          suggestionsList: classes.suggestionsList
        }}
        renderInputComponent={this.renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={{
          value: this.state.value,
          onChange: this.handleChange,
          onKeyDown: this.handleKeyDown
        }}
        onSuggestionSelected={this.handleSuggestionSelected}
        highlightFirstSuggestion
      />
    )
  }
}

export default Search
