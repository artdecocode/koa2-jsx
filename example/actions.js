const mapScripts = ([src, integrity, origin ]) => ({
  src, integrity, origin,
})
const mapCss = ([href, integrity, origin ]) => ({
  href, integrity, origin, rel: 'stylesheet',
})

const actions = {
  setTitle: title => ({ type: 'SET_TITLE', title }),

  addScript: scripts => ({
    type: 'ADD_SCRIPT_SOURCES',
    sources: scripts.map(mapScripts),
  }),

  addCss: css => ({
    type: 'ADD_CSS',
    css: typeof css === 'string' ? mapCss([css]) : css.map(mapCss),
  }),

  addJs: js => ({ type: 'ADD_JS', js: js.trim() }),
}

export default actions
