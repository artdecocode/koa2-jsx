import Koa from 'koa'
import View from './Containers/View'
import actions from './actions'
import reducer from './reducer'
import jsx, { prettyRender } from '../src'

const Store = jsx({
  actions,
  reducer,
  View,
  render: prettyRender, // or,
  pretty: true,
})

const app = new Koa()

/**
 * Install middleware
 */
app.use(Store)
app.use(async (ctx, next) => {
  ctx.setTitle('Welcome to the koa2-jsx world')

  ctx.addCss('https://fonts.googleapis.com/css?family=Dancing+Script:700')

  ctx.addCss([
    [
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
      ...(process.env.NODE_ENV === 'production' ? [
        'sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm',
        'anonymous',
      ] : []),
    ],
  ])

  ctx.addScript([
    [
      'https://code.jquery.com/jquery-3.2.1.slim.min.js',
      ...(process.env.NODE_ENV === 'production' ? [
        'sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN',
        'anonymous',
      ] : []),
    ],
    [
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
      ...(process.env.NODE_ENV === 'production' ? [
        'sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q',
        'anonymous',
      ] : []),
    ],
    [
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
      ...(process.env.NODE_ENV === 'production' ? [
        'sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl',
        'anonymous',
      ] : []),
    ],
  ])

  ctx.addJs('$(".alert").alert()')
  await next()
})
app.use(async (ctx, next) => {
  if (ctx.path != '/') return
  ctx.Content = <div>
    <h1> Hello from body </h1>
    <div className="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>Holy guacamole!</strong> You should check in on some of those fields below.
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>
  await next()
})

const server = app.listen(5000, () => {
  const { port } = server.address()
  console.log(`http://localhost:${port}`)
})
