const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['invert'],
  description: 'Your least favorite command is back!'
})
