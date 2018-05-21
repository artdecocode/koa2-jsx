const reg = require('@babel/register')
reg({
  cache: false,
})

require('.')
