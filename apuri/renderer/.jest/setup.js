import React from 'react'
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

// Make React and Enzyme functions available in all test files without importing
global.React = React
global.shallow = shallow
