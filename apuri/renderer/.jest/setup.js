import React from 'react'

import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// import configureStore from 'redux-mock-store'
// import thunk from 'redux-thunk'

global.React = React

configure({ adapter: new Adapter() })

// const mockStore = configureStore([thunk])
// global.mockStore = mockStore
