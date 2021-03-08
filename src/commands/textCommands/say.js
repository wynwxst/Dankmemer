const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let m = Memer.inviteRemoval(args.join(' '));
    return m;
  },
  {
    triggers: ['say', 'repeat'],
    description: 'Make the bot say whatever you want!',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say?'
  }
);
