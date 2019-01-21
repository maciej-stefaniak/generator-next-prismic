const isFunction = action => typeof action === 'function'

const customMiddleware = store => next => action => (isFunction(action) ? action(store.dispatch, store.getState) : next(action))

export default customMiddleware
