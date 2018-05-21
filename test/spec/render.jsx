import snapshotContext, { SnapshotContext } from 'snapshot-context' // eslint-disable-line
import Catchment from 'catchment'
import context from '../context'
import koa2Jsx, { nodeStreamRender, prettyRender } from '../../src'

const View = ({ children }) => (
  <div className="container">
    <div className="row">
      <div className="col">
        {children}
      </div>
    </div>
  </div>
)

/** @type {Object.<string, (ctx: context, sctx: SnapshotContext )>} */
const T = {
  context: [
    function () {
      Object.assign(this, context)
    },
    snapshotContext,
  ],
  async 'renders node stream'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      render: nodeStreamRender,
      View,
    })
    const b = new Catchment()
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content: 'test' })
    }
    await fn(ctx, next)
    const { body } = ctx
    body.pipe(b)
    const r = await b.promise
    await test('render/node.html', r)
  },
  async 'renders static node stream by default'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      View,
    })
    const b = new Catchment()
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content: 'test' })
    }
    await fn(ctx, next)
    const { body } = ctx
    body.pipe(b)
    const r = await b.promise
    await test('render/static.html', r)
  },
  async 'renders pretty html via pretty'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      View,
      pretty: true,
    })
    const b = new Catchment()
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content: 'test' })
    }
    await fn(ctx, next)
    const { body } = ctx
    await test('render/pretty.html', body)
  },
  async 'renders pretty html via render'({ SNAPSHOT_DIR }, { setDir, test }) {
    setDir(SNAPSHOT_DIR)
    const fn = koa2Jsx({
      View,
      render: prettyRender,
    })
    const b = new Catchment()
    const res = new Catchment()
    const ctx = {
      res,
    }
    const next = async () => {
      Object.assign(ctx, { Content: 'test' })
    }
    await fn(ctx, next)
    const { body } = ctx
    await test('render/pretty.html', body)
  },
}

export default T
