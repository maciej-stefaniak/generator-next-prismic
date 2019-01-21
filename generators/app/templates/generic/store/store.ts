import { createStore, compose, applyMiddleware } from 'redux'

import rootReducer from './reducers'
import { thunk /* , logger */ } from './middleware'

const createStoreWithMiddleware = applyMiddleware(thunk /* , logger */)(
  createStore
)

export default initialState =>
  createStoreWithMiddleware(rootReducer, initialState)
