const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['bed', 'monster'],
  description: 'lol rekt',
  doubleAvatar: true
})
