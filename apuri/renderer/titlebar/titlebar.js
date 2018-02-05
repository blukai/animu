import React from 'react'
import styled from 'styled-components'

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
  }
`

export default () => (
  <Wrapper>
    <Draggable />
    <Button id="minimize">
      <svg width="12" height="12">
        <line x1="0" y1="11.5" x2="12" y2="11.5" />
      </svg>
    </Button>
    <Button id="zoom">
      <svg width="12" height="12">
        <rect x="0.5" y="0.5" width="11" height="11" />
      </svg>
    </Button>
    <Button id="close">
      <svg width="12" height="12">
        <line x1="0" y1="0" x2="12" y2="12" />
        <line x1="12" y1="0" x2="0" y2="12" />
      </svg>
    </Button>
  </Wrapper>
)
