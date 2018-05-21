import { renderToStaticNodeStream, renderToStaticMarkup, renderToNodeStream } from 'react-dom/server'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { prettyPrint } from 'html'

export { default as wireframe } from './wireframe'
export { default as bootstrap } from './bootstrap'

const writeDoctype = (ctx) => ctx.res.write('<!doctype html>\n')

const writeHtml = (ctx) => {
  ctx.type = 'html'
  ctx.status = 200
  writeDoctype(ctx)
}

const staticNodeStreamRender = (ctx, WebSite) => {
  writeHtml(ctx)
  const stream = renderToStaticNodeStream(WebSite)
  ctx.body = stream
}
export const nodeStreamRender = (ctx, WebSite) => {
  writeHtml(ctx)
  const stream = renderToNodeStream(WebSite)
  ctx.body = stream
}

/**
 * Render html with indentation.
 */
export const prettyRender = (ctx, WebSite) => {
  writeHtml(ctx)
  const markup = renderToStaticMarkup(WebSite)
  const s = prettyPrint(markup)
  ctx.body = s
}

/**
 * A middleware constructor.
 * @param {function} reducer
 * @param {object} actions
 * @param {function} View
 * @param {function} render
 * @returns {Koa.Middleware}
 */
const makeStore = (reducer, actions, View, render) => {
  return async (ctx, next) => {
    const store = createStore(reducer)
    ctx.store = store
    assignContextActions(actions, ctx, store)
    await next()

    // so instead of giving you a function to render to include in middleware
    // chain, I just include render as the very last operation, assuming no
    // implications but there could be e.g., for error page.

    if (!ctx.Content) {
      return
    }
    const WebSite = (
      <Provider store={store}>
        <View>
          {ctx.Content}
        </View>
      </Provider>
    )
    render(ctx, WebSite)
  }
}

/**
 * Convert action creators from `actions` config into action dispatchers in the
 * context.
 * @param {object} actions
 * @param {object} ctx
 * @param {{dispatch:function}} store
 */
const assignContextActions = (actions, ctx, store) => {
  Object.keys(actions).forEach((key) => {
    const fn = actions[key]
    ctx[key] = (...args) => {
      const action = fn(...args)
      store.dispatch(action)
    }
  })
}

/**
 * @typedef {Object} Config
 * @property {function} View A Redux connected container
 * @property {function} [reducer] A root reducer to create the store
 * @property {Object} [actions] A map of action creators
 * @property {function} [render] An optional render function. Stream rendering
 * is used by default.
 */

/**
 * @param {Config} config
 */
const fn = (config = {}) => {
  const {
    View,
    reducer = () => ({}),
    actions = {},
    render = staticNodeStreamRender,
    pretty = false,
  } = config

  const r = pretty ? prettyRender : render

  const Store = makeStore(reducer, actions, View, r)
  return Store
}

export default fn
