import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import { reducer as anititles } from './actions/anititles'

const reducers = {
  anititles
}

const middlewares = [thunk, logger]

export default createStore(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
)
