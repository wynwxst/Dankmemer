const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['slap', 'batslap', 'batman'],
  description: 'Slap someone shitless with this.',

  doubleAvatar: true
})
