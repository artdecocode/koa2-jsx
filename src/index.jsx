import { renderToStaticNodeStream, renderToNodeStream, renderToStaticMarkup, renderToString } from 'react-dom/server'
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

const makeStreamRender = (_static) => {
  const render = _static ? renderToStaticNodeStream : renderToNodeStream
  return (ctx, WebSite) => {
    writeHtml(ctx)
    const stream = render(WebSite)
    ctx.body = stream
  }
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
 * @property {function} View A Redux connected container.
 * @property {function} [reducer] A root reducer to create the store.
 * @property {Object} [actions] A map of action creators.
 * @property {boolean} [static=true] String React's hydration metadata (default true)
 * @property {boolean} [pretty=false] Render formatted HTML (default false)
 * @property {(ctx, Website) => void} [render] An optional render function for more control in rendering.
 */

const makeMarkupRender = (_static, pretty) => {
  const render = _static ? renderToStaticMarkup : renderToString
  return (ctx, WebSite) => {
    writeHtml(ctx)
    const m = render(WebSite)
    const s = pretty ? prettyPrint(m) : m
    ctx.body = s
  }
}

const getRender = (_static, pretty) => {
  if (pretty) return makeMarkupRender(_static, pretty)
  return makeStreamRender(_static)
}

/**
 * @param {Config} config
 */
const fn = (config = {}) => {
  const {
    View,
    reducer = () => ({}),
    actions = {},
    static: _static = true,
    pretty = false,
    render = null,
  } = config

  const r = render || getRender(_static, pretty)

  const Store = makeStore(reducer, actions, View, r)
  return Store
}

export default fn
