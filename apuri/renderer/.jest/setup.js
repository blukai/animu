import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import React from 'react'

configure({ adapter: new Adapter() })

// Make React available in all test files without importing
global.React = React
