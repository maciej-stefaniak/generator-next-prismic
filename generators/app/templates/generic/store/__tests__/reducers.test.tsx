import { UI, FETCH_CONTENT, FETCH_DOCUMENT, FETCH_CONTENT_TYPE } from './../actions/types'
import ContentReducer from './../reducers/content'
import UIReducer from './../reducers/ui'

describe('Reducers tests', () => {
  it('Is content reducer working properly', () => {
    const actionContent = {
      type: FETCH_CONTENT,
      subType: 'some-key',
      payload: 'Hi5!'
    }
    const actionDocument = {
      type: FETCH_DOCUMENT,
      subType: 'some-key',
      payload: 'Hi5!'
    }
    const actionContentType = {
      type: FETCH_CONTENT_TYPE,
      subType: 'some-key',
      payload: 'Hi5!'
    }
    const newStateContent = ContentReducer({}, actionContent)
    const newStateDocument = ContentReducer({}, actionDocument)
    const newStateContentType = ContentReducer({}, actionContentType)

    expect(newStateContent).toEqual({'some-key': 'Hi5!'})
    expect(newStateDocument).toEqual({'some-key': 'Hi5!'})
    expect(newStateContentType).toEqual({'some-key': 'Hi5!'})
  })
  it('Is UI reducer working properly', () => {
    const actionUI = {
      type: UI,
      subType: 'menuOpened',
      payload: true
    }
    const initialState = {
      menuOpened: false,
      cookieMessageVisible: false
    }
    const newStateUI = UIReducer(initialState, actionUI)
    
    expect(newStateUI).toEqual({
      menuOpened: true,
      cookieMessageVisible: false
    })
  })
})