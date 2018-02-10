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

import Button from './button'
import { styles as appbarStyles } from './appbar'

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
    padding: `6px ${theme.spacing.unit}px`
  },

  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    marginRight: theme.spacing.unit
  },

  suggestionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: appbarStyles.appbarRoot.height
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
    padding: '4px 10px',
    borderRadius: 2
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

  inputAdornmentButton: {
    margin: 0,
    cursor: 'default'
  }
})

// ----

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
    suggestions: [],
    focused: false
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
            <InputAdornment position="start">
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

  renderSuggestionsContainer = ({ containerProps, children }) => {
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
        classes={{ root: classes.suggestionItem }}
        className={isHighlighted ? classes.suggestionItemHighlighted : ''}
        button
      >
        <ListItemText
          primary={jpt}
          secondary={eno}
          classes={{
            primary: classes.suggestionItemPrimaryText,
            secondary: classes.suggestionItemSecondaryText
          }}
        />
      </ListItem>
    )
  }

  // ----

  getSuggestionValue = ({ titles }) => titles[0]

  handleSuggestionsFetchRequested = async ({ value }) => {
    const { anime } = this.props

    try {
      const suggestions = await anime.getSearchSuggestions(value.trim())
      this.setState({
        suggestions
      })
    } catch (err) {
      console.error(err)
    }
  }

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] })
  }

  handleChange = (event, { newValue: value }) => {
    this.setState({
      value
    })
  }

  handleSuggestionSelected = (event, { suggestion: { id }, method }) => {
    console.log(method, id)
    // TODO: go to anime page
  }

  handleKeyDown = ({ target: { value }, key }) => {
    console.log(value, key)
    // TODO: go to search page
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
      />
    )
  }
}

export default Search
