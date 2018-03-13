import { combineReducers } from 'redux'

const title = (state = null, { type, title }) => {
  if (type !== 'SET_TITLE') return state
  return title
}
const js = (state = [], { type, js }) => {
  if (type !== 'ADD_JS') return state
  return [...state, js]
}
const scriptSources = (state = [], { type, src, sources }) => {
  switch (type) {
    case 'ADD_SCRIPT_SRC':
      return [...state, { src }]
    case 'ADD_SCRIPT_SOURCES':
      return [...state, ...sources]
    default:
      return state
  }
}
const links = (state = [], { type, css }) => {
  if (type !== 'ADD_CSS') return state
  return [...state, ...css]
}

export default combineReducers({
  title,
  js,
  scriptSources,
  links,
})
