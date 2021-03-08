const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['thesearch'],
  usage: '{command} <what the person says>',
  description: 'The Search',
  requiredArgs: 'You need to have something that the person says, try again',
  textLimit: 59,
  textOnly: true
})
