const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['failure', 'class'],
  description: 'lmfao u suck'
})
