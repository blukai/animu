import React, { Component } from 'react'
import styled from 'styled-components'
import { func } from 'prop-types'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`
export const Draggable = styled.div`
  flex-grow: 1;
  -webkit-app-region: drag;
`
export const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  & > svg {
    stroke: black;
    fill: none;
    stroke-width: 1.4;
  }
`

export default class Titlebar extends Component {
  static propTypes = {
    minimize: func.isRequired,
    zoom: func.isRequired,
    close: func.isRequired
  }

  render() {
    return (
      <Wrapper>
        <Draggable />
        <Button id="minimize" onClick={this.props.minimize}>
          <svg width="9" height="9">
            <line x1="0" y1="8.5" x2="9" y2="8.5" />
          </svg>
        </Button>
        <Button id="zoom" onClick={this.props.zoom}>
          <svg width="9" height="9">
            <rect x="0.5" y="0.5" width="8" height="8" />
          </svg>
        </Button>
        <Button id="close" onClick={this.props.close}>
          <svg width="9" height="9">
            <line x1="0" y1="0" x2="9" y2="9" />
            <line x1="9" y1="0" x2="0" y2="9" />
          </svg>
        </Button>
      </Wrapper>
    )
  }
}
