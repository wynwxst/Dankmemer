const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ args }) => args.join(' '),
  {
    triggers: ['say', 'repeat'],
    description: 'Make the bot say whatever you want!',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say?'
  }
)
