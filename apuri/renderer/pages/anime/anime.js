import React from 'react'

import { hot } from 'react-hot-loader'

import Typography from 'material-ui/Typography'

import Container from '../../components/container'

const Anime = ({ match }) => (
  <Container loading={false} error={false}>
    <Typography variant="headline">{match.params.id}</Typography>
  </Container>
)

export default hot(module)(Anime)
