const { equal, assert } = require('zoroaster/assert')
const context = require('../context')
const koa2Jsx = require('../..')

const koa2JsxTestSuite = {
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

module.exports = koa2JsxTestSuite
