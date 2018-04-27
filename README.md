# koa2-jsx

```bash
yarn add koa2jsx
```

`koa2-jsx` is a piece of _middleware_ for [`Koa2`][3] which provides support for
rendering JSX in a server application via `react-dom/server`. It also uses
`Redux` to create a store updatable with actions for a better control of what
data needs to be rendered, for example, it is possible to create a reducer with
`title` slice, and an action to set that property from `ctx`, and then print
`{ title }` in the template.

In addition to the core functionality, the package provides a minimum wireframe
View container and actions to set page title and viewport, add external and
inline scripts and styles, icons and a link to the manifest file.

Finally, there's an extra middleware function which can be used after
`koa2-jsx` and wireframe actions were installed to include links to
`Bootstrap 4` scripts (including jQuery) and CSS.

## API

The module will return a single middleware function which accepts 3 arguments:
`reducer`, `View` and `actions`. They are describe below in the
[_Example section_](#example).

The middleware function will perform the following for each request:

1. Initialise the Redux store by creating a **reducer**;
1. assign **actions** to the context, such as `{ setTitle(title) }` becomes
`ctx.setTitle`;
1. wait for all other middleware and pages to resolve; _and_
1. render `ctx.Content` if found using `react-dom/server` as a stream with
doctype html sent, using the **View**.

```jsx
import Koa from 'koa2'
import koa2Jsx from 'koa2-jsx'
import { combineReducers } from 'redux'
import { connect } from 'react-redux'

const app = new Koa()

const View = ({ title, children }) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

const jsx = koa2Jsx({
  reducer: combineReducers({
    title(state = null, { type, title }) {
      if (type !== 'SET_TITLE') return state
      return title
    }
  })
  actions: {
    setTitle(title) {
      return { type: 'SET_TITLE', title }
    }
  }
  View: connect(state => state)(View),
})

app.use(jsx, async (ctx, next) => {
  ctx.setTitle('Welcome to the koa2-jsx world')
  ctx.Content = <div><h1> Hello @ there </h1></div>
  await next()
})
```

When setting up middleware, ensure that the `koa2-jsx` middleware function comes
ahead of pages so that the Redux store and render logic are initialised.

If `ctx.Content` is set in downstream application middleware, `<!doctype html>`
is written and a readable stream from React Dom's
`renderToStaticNodeStream(<WebPage />)` is be piped into `ctx.body`.

### `koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object,`<br/>&nbsp;&nbsp;`render?: function,`<br/>&nbsp;&nbsp;`pretty = false: boolean,`<br/>`}): function`

This will set up the middleware function and return it. Add it as a usual Koa2
middleware (shown below).

### Example

The example shows how to create a reducer, actions and View for a minimum HTML
template.

```js
// Checkout ./example/index.jsx for a fuller example.
// Run yarn example to start the demo server.

import Koa from 'koa2'
import koa2Jsx from 'koa2-jsx'
import actions from './actions'
import reducer from './reducer'
import View from './Containers/View'

const app = new Koa()

const jsx = koa2Jsx({
  reducer,
  View,
  actions,
  pretty: false, // set to true for prettified HTML output
})

app.use(jsx, async (ctx, next) => {
  ctx.setTitle('Welcome to the koa2-jsx world')
  ctx.Content = <div><h1>Hello @ there</h1></div>
  await next()
})
```

### reducer

The reducer is either a simple function or a combination of reducers created
with `combineReducers` from the `redux` package. The reducer is used
during initialisation of the middleware to create a _store_ with
`createStore(reducer)`. The _store_ is used in rendering as context for the
_View_ container. This way, we pass data to the template by invoking methods on
the Koa's context (see actions).

```js
import { combineReducers } from 'redux'

const title = (state = null, { type, title }) => {
  if (type !== 'SET_TITLE') return state
  return title
}

export default combineReducers({
  title,
})
```

### View

The view can be a connected `react-redux` component when actions and a reducer
are used, or a pure `React` component when they're omitted. It follows the
same principles as when developing for a browser-side `react-redux` application,
so that it accepts the state of the reducer as the first argument, with
`children` property (set with `ctx.Content`).

```js
import { connect } from 'react-redux'

const View = ({ title, children }) => {
  return (
    <html lang="en">
      <head>
        <title>{title}</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

export default connect(state => state)(View)
```

### actions

Actions map action creators to Koa's context, so that it is possible to dispatch
actions from `ctx` to control the state and thus data which goes into the
template.

```js
const actions = {
  // exported as ctx.setTitle()
  setTitle: title => ({ type: 'SET_TITLE', title }),
}

export default actions
```

### render

It is possible to pass a custom render function. It accepts Koa's context and
the container to render. For example, a prettified HTML render looks like the
following:

```js
import { renderToStaticMarkup } from 'react-dom/server'

const render = (ctx, WebSite) => {
  ctx.type = 'html'
  ctx.status = 200
  ctx.res.write('<!doctype html>\n')
  const markup = renderToStaticMarkup(WebSite)
  const s = prettyPrint(markup)
  ctx.body = s
}
```

and the default stream render:

```js
import { renderToStaticNodeStream } from 'react-dom/server'

const defaultRender = (ctx, WebSite) => {
  ctx.type = 'html'
  ctx.status = 200
  ctx.res.write('<!doctype html>\n')
  const stream = renderToStaticNodeStream(WebSite)
  ctx.body = stream
}
```

You must implement your own render for more complex scenarios. It accepts
a `WebSite` which is a View container wrapper in a state provider.

### pretty

When `pretty` config property is set to `true`, HTML will be indented using
`html` package. Bear in mind, that serving of pages will be slower, as it is
not done as a stream, but requires to write all HTML into a string first to
format it.

## Wireframe

The wireframe provides a `reducer`, `actions` and `View` to be used when
creating web pages. It accounts for most common use cases, such as assigning
viewport and icons. To include it in your application, use:

```js
import koa2Jsx, { wireframe } from 'koa2-jsx'

const jsx = koa2Jsx(wireframe)

/* or using object destructuring */

const jsx = koa2Jsx({
  ...wireframe,
  pretty: true,
})
```

### Template

The following template is used, which allows to set viewport, title, add links, external scripts and script and style blocks.

```html
<html lang="en">
  <head>
    <meta charSet="utf-8" />
    {viewport &&
      <meta name="viewport" content={viewport} />
    }

    <title>{title}</title>

    <!-- css, icons, manifest -->
    {links.map((props, i) =>
      <link key={i} {...props} />
    )}
    <!-- CSS -->
    {styles.map((style, i) =>
      <style key={i} dangerouslySetInnerHTML={{ __html: style }} />
    )}
  </head>
  <body>
    {children}

    {scripts.map((props, i) =>
      <script key={i} {...props} />
    )}
    {js.map((script, i) =>
      <script key={i} dangerouslySetInnerHTML={{ __html: script }} />
    )}
  </body>
</html>
```

## Actions

To update the data to present in the template, the actions API is as follows.

### `setTitle(title)`

Set title of the page.

```js
ctx.setTitle('koa2-jsx')
```

```html
<title>koa2-jsx</title>
```

### `setViewport(viewport)`

Set the viewport.

```js
ctx.setViewport('width=device-width, initial-scale=1, shrink-to-fit=no')
```

```html
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
```


### `addManifest(href)`

Add a link to the manifest file.

```js
ctx.addManifest('/manifest.json')
```

```html
<link rel="manifest" href="/manifest.json" />
```

### `addIcon(href | [[href, type, sizes, ref=icon]])`

Add an icon or icons links.

```js
ctx.addIcon('/icons/favicon.ico')
ctx.addIcon([
  [
    '/icons/favicon-32x32.png',
    'image/png',
    '32x32',
  ],
  [
    '/icons/apple-icon-180x180.png',
    'image/png',
    '180x180',
    'apple-touch-icon',
  ],
])
```

```html
<link href="/icons/favicon.ico" rel="icon" />
<link href="/icons/favicon-32x32.png" type="image/png" sizes="32x32" rel="icon" />
<link href="/icons/apple-icon-180x180.png" type="image/png" sizes="180x180" rel="apple-touch-icon" />
```

### `addScript(src | [[src, integrity, origin]])`

Add a single, or multiple script tags. If integrity and origin need to be used,
an array must be passed.

```js
ctx.addScript('/js/bundle.js')
ctx.addScript([
  [
    'https://code.jquery.com/jquery-3.2.1.slim.min.js',
    ...(process.env.NODE_ENV === 'production' ? [
      'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN',
      'anonymous',
    ] : []),
  ],
])
```

```html
<script src="/js/bundle.js"></script>
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" origin="anonymous"></script>
```

### `addCss(href | [[href, integrity, origin]])`

Add a single, or multiple style links. If integrity and origin need to be
specified, an array must be passed.

```js
ctx.addCss('https://fonts.googleapis.com/css?family=Roboto:700&effect=anaglyph|3d-float')
ctx.addCss([
  [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    ...(process.env.NODE_ENV === 'production' ? [
      'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm',
      'anonymous',
    ] : []),
  ],
])
```

```html
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" origin="anonymous" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css?family=Roboto:700&amp;effect=anaglyph|3d-float" rel="stylesheet" />
```

### `addStyle(style)`

Add a style block to the HTML.

```js
ctx.addStyle('h1 { font-family: \'Roboto\', sans-serif; }')
```

```html
<style>
    h1 { font-family: 'Roboto', sans-serif; }
</style>
```

### `addJs(js)`

Add a block of JS code.

```js
ctx.addJs('$(".alert").alert()')
```

```html
<script>
    $(".alert").alert()
</script>
```

## Bootstrap

To include the full `Bootstrap 4` support to an HTML page, use the
following snippet:

```js
import koa2Jsx, { bootstrap, wireframe } from 'koa2-jsx'

const jsx = koa2Jsx(wireframe)

// ...
app.use(jsx)
app.use(bootstrap)
```

```html
<!-- viewport is assigned -->
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

<!-- css embedded -->
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" origin="anonymous" rel="stylesheet" />

<!-- script tags included -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" origin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" origin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" origin="anonymous"></script>
```


## Babel

To start using `koa2-jsx`, you really need to be able to write `JSX` syntax.
During development, use `@babel/register`, and for production compile your
project. You can of course create classes with `create-react-class`
(see [reading](#reading)) and then not require babel transpilation but the
point of this package is to write `JSX` which is unfortunately is not native to
_Node.JS_.

### Development

`@babel/register` is a good way to develop with koa and `koa2-jsx`, however
when using in production, it is recommended to build the app.

```js
require('@babel/register')
require('.')
```

### babelrc

To build JSX code, you can use the following `.babelrc` snippet:

```json
{
  "plugins": [
    "react-require",
    "@babel/plugin-transform-modules-commonjs",
    "@babel/plugin-proposal-object-rest-spread"
  ],
  "presets": [
    "@babel/preset-react"
  ]
}
```

> _Although using `object-rest-spread` in Node.JS is not required, here it is included to satisfy `babel`._


<!-- ## Project structure

You can use `containers` and `components` folders and put tests in
there as well.

The routes, if you're using a router, routes will import the jsx
pages, and do `ctx.Content = <Page/>; await next()` to render a page.

```sh
- src
  - Components
    - View.jsx
  - Containers
    - View.jsx
    - View.test.jsx
  - Pages
    - Index.jsx
  - routes
    - index.js
``` -->

## Using with [idio][2]

The `koa2-jsx` middlware comes with the Koa2-based framework [`idio`][2] which
apart from other pre-installed middleware such as sessions and Mongo support
out of the box, also provides automatic routes initialisation from a given
folder and hot route reload.

With `koa2-jsx`, `idio` allows to [use JSX with Koa2][2] for templates. It's
very powerful and can be used in isomorphic applications.

## Reading

- [Redux Server Rendering][4] explains how to render pages with a store
server-side, and send initial data to the browser.
- [React without ES6][5] talks about how to use `create-react-class` to create
instances of components, that is not using `jsx` syntax.

---

(c) [sobes][1] 2018

[1]: https://sobes.io
[2]: https://idio.cc
[3]: http://koajs.com
[4]: https://redux.js.org/recipes/server-rendering
[5]: https://reactjs.org/docs/react-without-es6.html
