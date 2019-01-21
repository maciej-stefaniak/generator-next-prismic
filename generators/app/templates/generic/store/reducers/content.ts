import {
  FETCH_CONTENT,
  FETCH_DOCUMENT,
  FETCH_CONTENT_TYPE
} from '../actions/types'

const initialState = {}

const contentReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CONTENT:
    case FETCH_DOCUMENT:
    case FETCH_CONTENT_TYPE:
      const newData = {}
      newData[action.subType] = action.payload

      return {
        ...state,
        ...newData
      }
    default:
      return state
  }
}
export default contentReducer
