import Koa from 'koa'
import serve from 'koa-static'
import { resolve } from 'path'
import koa2Jsx, { wireframe, bootstrap, prettyRender } from 'koa2-jsx'

const jsx = koa2Jsx({
  ...wireframe,
  render: prettyRender, // or,
  pretty: true,
})

const app = new Koa()

app.use(serve(resolve(__dirname, 'static')))

app.use(jsx)
app.use(bootstrap)

/**
 * @type {Koa.Middleware}
 */
const page = async (ctx, next) => {
  ctx.setTitle('Welcome to the koa2-jsx world')

  ctx.addCss('https://fonts.googleapis.com/css?family=Roboto:700&effect=anaglyph|3d-float')
  ctx.addStyle('h1 { font-family: \'Roboto\', sans-serif; }')

  ctx.addManifest('/manifest.json')
  ctx.addIcon([
    [
      '/icons/favicon-16x16.png',
      'image/png',
      '16x16',
    ],
    [
      '/icons/favicon-32x32.png',
      'image/png',
      '32x32',
    ],
    [
      '/icons/favicon-96x96.png',
      'image/png',
      '96x96',
    ],
    [
      '/icons/apple-icon-180x180.png',
      'image/png',
      '180x180',
      'apple-touch-icon',
    ],
    [
      '/icons/android-icon-192x192.png',
      'image/png',
      '192x192',
    ],
  ])

  await next()
}

app.use(page)
app.use(async (ctx, next) => {
  if (ctx.path != '/') return

  ctx.Content = <div className="container">
    <h1 className="font-effect-anaglyph"> Hello from body </h1>
    <div className="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Well done!</strong> You&apos;ve successfully started an example
      of <code>koa2-jsx</code> which renders a Bootstrap page with this alert. You can
      close it with the button on the right.
      <button type="button" className="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  </div>

  ctx.addJs('$(".alert").alert()')

  await next()
})

const server = app.listen(5000, () => {
  const { port } = server.address()
  console.log(`http://localhost:${port}`)
})
