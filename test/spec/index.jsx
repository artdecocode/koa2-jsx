import { equal, deepEqual } from 'zoroaster/assert'
import context from '../context'
import koa2Jsx from '../../src'

const View = ({ children }) => <div><children /></div>

export default {
  context,
  'should be a function'() {
    equal(typeof koa2Jsx, 'function')
  },
  async 'does not call render if content is not set'() {
    let called
    const render = (a) => { called = a }
    const fn = koa2Jsx({
      render,
      View,
    })
    const next = async () => {}
    await fn({}, next)
    equal(called, undefined)
  },
  async 'calls render if Content is set'() {
    let called
    const render = (a) => { called = a }
    const fn = koa2Jsx({
      render,
      View,
    })
    const ctx = {}
    const next = async () => {
      Object.assign(ctx, { Content: 'test' })
    }
    await fn(ctx, next)
    equal(called, ctx)
  },
  async 'assigns actions to context'() {
    const render = () => {}
    const fn = koa2Jsx({
      render,
      View,
      reducer(state = {}, action) {
        if (action.type == 'SET_TITLE') return { ...state, title: action.title }
        return state
      },
      actions: {
        setTitle(title) {
          return { type: 'SET_TITLE', title }
        },
      },
    })
    const ctx = {}
    const next = async () => {
      equal(typeof ctx.setTitle, 'function')
      ctx.setTitle('test')
    }
    await fn(ctx, next)
    const state = ctx.store.getState()
    deepEqual(state, { title: 'test' })
  },
}
