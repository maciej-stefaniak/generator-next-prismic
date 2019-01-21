import { combineReducers } from 'redux'
import ContentReducer from './content'
import UIReducer from './ui'

const rootReducer = combineReducers({
  content: ContentReducer,
  ui: UIReducer
})

export default rootReducer
