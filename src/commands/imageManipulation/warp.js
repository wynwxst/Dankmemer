const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['warp'],
  description: 'Your least favorite command is back!'
})
