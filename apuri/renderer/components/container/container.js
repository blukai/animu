import React from 'react'
import { bool, node } from 'prop-types'

export const Error = () => 'Oops. Something went wrong.'

export const Loading = () => 'Loading..'

const Container = ({ error, loading, children }) =>
  error ? <Error /> : loading ? <Loading /> : children

Container.propTypes = {
  error: bool.isRequired,
  loading: bool.isRequired,
  children: node.isRequired
}

export default Container
