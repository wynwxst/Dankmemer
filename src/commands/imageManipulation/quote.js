const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['quote'],
  usage: '{command} <user to impersonate> <thing to make them say>',
  description: 'make people say stuff',

  requiredArgs: 'Who is saying what? ',
  textLimit: 250
})
