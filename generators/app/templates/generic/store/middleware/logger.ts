const logger = store => next => action => {
  if (process.env.NODE_ENV === 'development') {
    console.log('dispatching', action)
  }
  const result = next(action)
  if (process.env.NODE_ENV === 'development') {
    console.log('next state', store.getState())
  }
  return result
}

export default logger
