const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['fakenews', 'fake'],
  description: 'CNN!'
})
