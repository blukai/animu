import React from 'react'
import { bool, node, object } from 'prop-types'

import { withStyles } from 'material-ui/styles'

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 60,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto'
  })
})

export const Error = () => 'Oops. Something went wrong.'

export const Loading = () => 'Loading..'

export const Container = ({ error, loading, children, classes }) => (
  <div className={classes.root}>
    {error ? <Error /> : loading ? <Loading /> : children}
  </div>
)

Container.propTypes = {
  error: bool.isRequired,
  loading: bool.isRequired,
  children: node.isRequired,
  classes: object.isRequired
}

export default withStyles(styles)(Container)
