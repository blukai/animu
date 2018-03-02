import React, { Component } from 'react'
import { object, func, shape, bool, array } from 'prop-types'

import { connect } from 'react-redux'

import { withStyles } from 'material-ui/styles'
import Input from 'material-ui/Input'
import Paper from 'material-ui/Paper'
import { ListItem, ListItemText } from 'material-ui/List'

import { getSearchSuggestions } from '../actions/search'

const styles = {
  container: {
    position: 'relative',
    flexGrow: 1
  },
  suggestions: {
    position: 'absolute',
    width: '100%'
  }
}

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
    suggestions: []
  }

  // ----

  componentWillUpdate(nextProps) {
    const { payload: prev } = this.props.suggestions
    const { payload: next } = nextProps.suggestions
    if (prev.length !== next.length) {
      this.transformSuggestions(next)
    }
  }

  // input

  handleChange = event => {
    const { value } = event.target
    this.setState({ value })
    if (this.shouldSuggest()) {
      this.props.getSuggestions(value)
    }
  }

  // helpers

  shouldSuggest() {
    const { value } = this.state
    if (value && value.length >= 3) {
      return true
    }
    return false
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
    return (
      <Input
        fullWidth
        placeholder="Anime Search"
        onChange={this.handleChange}
      />
    )
  }

  renderSuggestions() {
    const { classes, suggestions } = this.props
    const { value } = this.state

    return (
      <Paper square classes={{ root: classes.suggestions }}>
        {this.shouldSuggest() &&
          this.state.suggestions.map(({ id, titles: { main, official } }) => (
            <ListItem key={id} button>
              <ListItemText
                primary={main}
                secondary={main !== official && official}
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
