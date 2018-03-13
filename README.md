# koa2-jsx

`koa2-jsx` is a _middleware_ for [`Koa2`][3] which provides support for
rendering JSX in a server application via `react-dom/server`. It also uses
`Redux` to create a store updatable with actions. Therefore, you can render
JSX pages server-side easily. You will probably want to be transpiling your
own code when writing with this syntax, but the module has been transpiled to
`ES5`, so you don't need to worry about that.

## Constructor

The module will return a single middleware function and accepts 3 arguments:
`reducer`, `View` and `actions`. They are describe below in the
[_Example section_](#example).

The middleware funtion will perform the following for each request:

1. Initialise the Redux store;
1. export actions' API via context, such as `{ setTitle(title) }` becomes `ctx.setTitle`;
1. wait for all other middleware and pages to resolve; _and_
1. render `ctx.Content` if found using `react-dom/server` as a stream with
doctype html sent.

```js
// ./example.jsx
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
})

app.use(jsx, async (ctx, next) => {
  ctx.setTitle('Welcome to the koa2-jsx world')
  ctx.Content = <div><h1> Hello @ there </h1></div>
  await next()
})
```

When setting up middleware, ensure that the created `jsx` function comes ahead
of pages so that the Redux store is initialised as well as final render set up.

If `ctx.Content` is set in downstream application middleware, a readable stream
from React Dom's `renderToStaticNodeStream(<WebPage />)` is be piped into
`ctx.body` after `<!doctype html>` is written.

## `koa2Jsx({`<br/>&nbsp;&nbsp;`reducer: function,`<br/>&nbsp;&nbsp;`View: Container,`<br/>&nbsp;&nbsp;`actions: object`<br/>`}): function`

This will setup the middleware function and return it. Add it as a usual Koa2 middleware (shown below).

## Example

To start using `koa2-jsx`, you really need to be able to write `jsx` syntax.
During development, use `@babel/register`, and for production compile your
project. You can of course create classes with `create-react-class`
(see [reading](#reading)) and then not require babel transpilation but the
point of this package is to write `jsx` which should really be native for
_Node.js._


```js
// ./example/require.js
require('@babel/register')

require('.')
```

The example shows how to create a reducer, actions and a View for minimum HTML
template.

```js
// ./example/index.jsx, yarn example
import Koa from 'koa2'
import koa2Jsx from 'koa2-jsx'
import actions from './actions'
import reducer from './reducer'
import View from './Containers/View'

const app = new Koa()

const jsx = koa2Jsx({
  reducer, // allows to set title
  View, // template with <html>, <head> and <body>
  actions,
})

app.use(jsx, async (ctx, next) => {
  ctx.setTitle('Welcome to the koa2-jsx world')
  ctx.Content = <div><h1>Hello @ there</h1></div>
  await next()
})
```

### Reducer

The reducer is either a simple function or a combination of reducers creaded
with `import { combineReducers } from 'redux`. The reducer is used
during initialisation of the middleware to create a store `createStore(reducer)`.
The _store_ is used in rendering as context for the _View_:
`<Provider store={store}><View>{ children }</View></Provider>`.

```js
import { combineReducers } from 'redux'

const title = (state = null, { type, title }) => {
  if (type !== 'SET_TITLE') return state
  return title
}
const scripts = (state = [], { type, script }) => {
  if (type !== 'ADD_SCRIPT') return state
  return [...state, script]
}
const scriptsSrc = (state = [], { type, src }) => {
  if (type !== 'ADD_SCRIPT_SRC') return state
  return [...state, src]
}

export default combineReducers({
  title,
  scripts,
  scriptsSrc,
})
```


### View

The view is a `React` component or `react-redux` connected component,

### Actions

Actions are functions available to the controllers in `ctx.[acitonName]`, such as `ctx.setTitle`. An action has not got access to dispatch, however it should return an object, therefore it's actually an action creators. No `(thunks)` yet sorry but it should be added in the newer version (PR welcome).

```js
// example/actions.js
const actions = {
  setTitle: title => ({ type: 'SET_TITLE', title }),
  addScriptSrc: src => ({ type: 'ADD_SCRIPT_SRC', src }),
  addScript: script => ({ type: 'ADD_SCRIPT', script: script.trim() }),
}

export default actions
```

## babelrc.js


To build such code, you can use the following `.babelrc` snippet:

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

_Personally, I'm not sure why I have to use object-rest-spread with Node, but this is to satisfy `babel`._


## Project structure

You can use `containers` and `components` folders and put tests in
there as well. The routes, if you're using a router, routes will import the jsx pages, and do `ctx.Content = <Page/>; await next()`
to render a page.

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
```


## `koa2Jsx():void`

Call this function to get a result you want.

```js
const koa2Jsx = require('koa2-jsx')

koa2Jsx()
```

## How to set up middleware

The middlware has been compiled to `es5`,

```jsx

```

### Setting up using [idio][2]

The `koa2-jsx` middlware comes with the Koa2-based framework [`idio`][2] which apart from other pre-installed middleware such as sessions and Mongo DB support out of the box, also
provides automatic routes initialisation from a given folder and hot route
reload.

With `koa2-jsx`, `idio` allows to [use jsx with Koa2][2] for templates. It's very powerful and can be used in isomorphic applications.

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
