const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ cleanArgs }) => {
    let args = cleanArgs

    if (args.join(' ').length > 55) {
      return 'Keep it under 55 characters fam'
    }

    if (args.length === 1) {
      return args[0].split('').join(' <a:partyparrot:429416315695005696> ')
    } else {
      return args.join(' <a:partyparrot:429416315695005696> ')
    }
  }, {
    triggers: ['partyparrot', 'party'],
    description: 'Make the bot say whatever you want in party form!',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say?'
  }
)
