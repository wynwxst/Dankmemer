const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ cleanArgs }) => {
    let args = cleanArgs

    if (args.join(' ').length > 666) {
      return 'Keep it under 666 characters fam'
    }

    if (args.length === 1) {
      return args[0].split('').join(' 👏 ')
    } else {
      return args.join(' 👏 ')
    }
  }, {
    triggers: ['clap', 'clapify'],
    description: 'Make the bot say whatever you want with sass!',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say?'
  }
)
