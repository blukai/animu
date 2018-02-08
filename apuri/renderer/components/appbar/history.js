import React, { Component } from 'react'

import BackIcon from 'material-ui-icons/ArrowBack'

import Button from './button'

class History extends Component {
  render() {
    return (
      <Button disabled>
        <BackIcon />
      </Button>
    )
  }
}

export default History
