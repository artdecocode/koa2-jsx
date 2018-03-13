import { equal, assert } from 'zoroaster/assert'
import context from '../context'
import koa2Jsx from '../..'

export default {
  context,
  'should be a function'() {
    equal(typeof koa2Jsx, 'function')
  },
  'should call package without error'() {
    assert.doesNotThrow(() => {
      koa2Jsx()
    })
  },
}
