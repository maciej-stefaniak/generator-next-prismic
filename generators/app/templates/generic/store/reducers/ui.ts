import { UI } from '../actions/types'

const initialState = {
  menuOpened: false,
  cookieMessageVisible: false
}

const UIReducer = (state = initialState, action) => {
  switch (action.type) {
    case UI:
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
export default UIReducer
