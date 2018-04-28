import { renderToStaticNodeStream, renderToStaticMarkup } from 'react-dom/server'
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

const defaultRender = (ctx, WebSite) => {
  writeHtml(ctx)
  const stream = renderToStaticNodeStream(WebSite)
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

const makeStore = (reducer, actions, View, render) => {
  return async (ctx, next) => {
    const store = createStore(reducer)
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


const assignContextActions = (actions, ctx, store) => {
  Object.keys(actions).forEach((key) => {
    const fn = actions[key]
    ctx[key] = (...args) => {
      const action = fn(...args)
      store.dispatch(action)
    }
  })
}

export default (config) => {
  const {
    View,
    reducer,
    render = defaultRender,
    actions = {},
    pretty = false,
  } = config

  const r = pretty == true ? prettyRender : render

  const Store = makeStore(reducer, actions, View, r)
  return Store
}
