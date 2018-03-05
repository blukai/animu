import React, { Component } from 'react'
import { bool, arrayOf, shape, func, number, string, object } from 'prop-types'

import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from 'material-ui/styles'

import Autosuggest from 'react-autosuggest'
import Input, { InputAdornment } from 'material-ui/Input'
import Paper from 'material-ui/Paper'
import { MenuItem } from 'material-ui/Menu'
import { ListItemText } from 'material-ui/List'
import SearchIcon from 'material-ui-icons/Search'
import ClearIcon from 'material-ui-icons/Clear'
import IconButton from 'material-ui/IconButton'

import { getSuggestions, clearSuggestions } from '../actions/search'
import { objectizeTitleArray } from '../helpers'

const styles = theme => ({
  container: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: '100%'
  },
  suggestionsContainer: {
    position: 'absolute',
    width: '100%',
    top: '100%'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none'
  },
  suggestionItem: {
    padding: `6px 10px`,
    height: 'auto'
  },
  suggestionItemTextPrimary: {
    fontSize: 15,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  suggestionItemTextSecondary: {
    fontSize: 13,
    fontWeight: theme.typography.fontWeightLight
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
  }
})

class Search extends Component {
  static propTypes = {
    error: bool.isRequired,
    loading: bool.isRequired,
    suggestions: arrayOf(
      shape({
        id: number.isRequired,
        titles: arrayOf(string).isRequired
      }).isRequired
    ).isRequired,
    onSuggestionsFetchRequested: func.isRequired,
    onSuggestionsClearRequested: func.isRequired,
    classes: object.isRequired,
    history: object.isRequired,
    location: object.isRequired
  }

  // ----

  state = {
    value: ''
  }

  input = null

  // ----

  onChange = (event, { newValue }) => {
    this.setState({ value: newValue })
  }

  getSuggestionValue = ({ titles }) => titles[0]

  onSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault()
    const { pathname: prev } = this.props.location
    const next = `/anime/${suggestion.id}`
    if (prev !== next) {
      this.props.history.push(next)
    }
    this.input.blur()
  }

  clearValue = () => {
    this.setState({ value: '' })
  }

  // renderers

  renderInput = props => {
    const { ref, ...inputProps } = props
    const { classes } = this.props
    const { value } = this.state

    return (
      <Input
        className={classes.input}
        fullWidth
        inputRef={ref}
        inputProps={inputProps}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon
              className={classes.inputIcon}
              color={value && value.length > 0 ? 'inherit' : 'disabled'}
            />
          </InputAdornment>
        }
        endAdornment={
          value &&
          value.length > 0 && (
            <InputAdornment position="end">
              <IconButton
                className={classes.inputIcon}
                onClick={this.clearValue}
              >
                <ClearIcon className={classes.inputIcon} />
              </IconButton>
            </InputAdornment>
          )
        }
      />
    )
  }

  renderSuggestion = ({ titles }) => titles[0]

  renderSuggestionsContainer = ({ containerProps, children }) => (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )

  renderSuggestion = ({ id, titles }, { query, isHighlighted }) => {
    const { classes } = this.props
    const { main: mainTitle, official: officialTitle } = objectizeTitleArray(
      titles
    )

    return (
      <MenuItem
        selected={isHighlighted}
        component="div"
        className={classes.suggestionItem}
      >
        <ListItemText
          primary={mainTitle || officialTitle}
          secondary={mainTitle && mainTitle !== officialTitle && officialTitle}
          classes={{
            primary: classes.suggestionItemTextPrimary,
            secondary: classes.suggestionItemTextSecondary
          }}
        />
      </MenuItem>
    )
  }

  // ----

  render() {
    const {
      error,
      loading,
      suggestions,
      onSuggestionsFetchRequested,
      onSuggestionsClearRequested,
      classes
    } = this.props

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainer: classes.suggestionsContainer,
          suggestionsList: classes.suggestionsList
        }}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        suggestions={suggestions}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        renderSuggestion={this.renderSuggestion}
        renderInputComponent={this.renderInput}
        inputProps={{
          placeholder: 'Anime Search',
          value: this.state.value,
          onChange: this.onChange
        }}
        onSuggestionSelected={this.onSuggestionSelected}
        ref={as => {
          if (as) {
            this.input = as.input
          }
        }}
      />
    )
  }
}

const mapState = ({ searchSuggestions }) => {
  const { error, loading, payload } = searchSuggestions
  return {
    error,
    loading,
    suggestions: payload
  }
}

const mapDispatch = dispatch => ({
  onSuggestionsFetchRequested: ({ value }) => {
    dispatch(getSuggestions(value))
  },
  onSuggestionsClearRequested: () => {
    dispatch(clearSuggestions())
  }
})

export default withRouter(
  connect(mapState, mapDispatch)(withStyles(styles)(Search))
)
