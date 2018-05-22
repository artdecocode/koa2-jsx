import { equal } from 'assert'
import { renderToStaticMarkup } from 'react-dom/server'
import snapshotContext, { SnapshotContext } from 'snapshot-context' // eslint-disable-line
import Catchment from 'catchment'
import context from '../context'
import koa2Jsx from '../../src'

const View = ({ children }) => (
  <div className="container">
    <div className="row">
      <div className="col">
        {children}
      </div>
    </div>
  </div>
)

const Content = <p>Test</p>

/** @type {Object.<string, (ctx: context, sctx: SnapshotContext )>} */
const T = {
  context: [
    function () {
      Object.assign(this, context)
    },
    snapshotContext,
  ],
  async 'renders a static node stream by default'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({ View })
    const b = new Catchment()
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content })
    }
    await fn(ctx, next)
    const { body } = ctx
    body.pipe(b)
    const r = await b.promise
    await test('render/static-stream.html', r)
  },
  async 'renders a non-static node stream'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({ View, static: false })
    const b = new Catchment()
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content })
    }
    await fn(ctx, next)
    const { body } = ctx
    body.pipe(b)
    const r = await b.promise
    await test('render/stream.html', r)
  },
  async 'renders a static pretty string'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      View,
      pretty: true,
    })
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content })
    }
    await fn(ctx, next)
    const { body } = ctx
    await test('render/static-pretty.html', body)
  },
  async 'renders non-static pretty string'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      View,
      static: false,
      pretty: true,
    })
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content })
    }
    await fn(ctx, next)
    const { body } = ctx
    await test('render/pretty.html', body)
  },
  async 'renders with supplied renderer'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      View,
      render(ctx, WebSite) {
        ctx.type = 'html'
        ctx.status = 250
        ctx.body = renderToStaticMarkup(<div className="render-test">{WebSite}</div>)
      },
    })
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content })
    }
    await fn(ctx, next)
    const { status, type, body } = ctx
    equal(type, 'html')
    equal(status, 250)
    await test('render/render.html', body)
  },
}

export default T
