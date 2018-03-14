import { combineReducers } from 'redux'

const title = (state = null, { type, title }) => {
  if (type !== 'SET_TITLE') return state
  return title
}

const scripts = (state = [], { type, sources }) => {
  switch (type) {
    case 'ADD_SCRIPT_SOURCES':
      return [...state, ...sources]
    default:
      return state
  }
}
const links = (state = [], { type, css, links }) => {
  switch (type) {
    case 'ADD_CSS':
      return [...state, ...css]
    case 'ADD_LINKS':
      return [...state, ...links]
    default:
      return state
  }
}

const js = (state = [], { type, js }) => {
  if (type !== 'ADD_JS') return state
  return [...state, js]
}

const styles = (state = [], { type, style }) => {
  if (type != 'ADD_STYLE') return state
  return [...state, style]
}

const viewport = (state = null, { type, viewport }) => {
  if (type != 'SET_VIEWPORT') return state
  return viewport
}

export default combineReducers({
  title,
  js,
  scripts,
  links,
  styles,
  viewport,
})
