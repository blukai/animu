import { createStore, combineReducers, applyMiddleware } from 'redux'
// middlewares
import thunk from 'redux-thunk'
import logger from 'redux-logger'

const reducers = {}

const middlewares = [thunk, logger]

export default createStore(
  combineReducers(reducers),
  applyMiddleware(...middlewares)
)
