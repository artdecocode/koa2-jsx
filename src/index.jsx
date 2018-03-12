// /**
//  * @typedef {Object} Options
//  * @property {string}
//  */

// /**
//  * Invoke package's main function
//  */
// function koa2Jsx(options) {
//   console.log('koa2-jsx called')
// }

// module.exports = koa2Jsx


import { renderToStaticNodeStream } from 'react-dom/server'
import { Provider } from 'react-redux'

const render = View => async (ctx, next) => {
  if (!ctx.Content) {
    await next()
    return
  }
  console.log('rendering a page')
  const stream = renderToStaticNodeStream(
    <Provider store={ctx.store}>
      <View>
        {ctx.Content}
      </View>
    </Provider>
  )
  ctx.type = 'html'
  ctx.status = 200
  ctx.res.write('<!doctype html>')
  ctx.body = stream
  await next()
}

export default render
