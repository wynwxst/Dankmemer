const { GenericCommand } = require('../../../models/');
const commands = require('./commands');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    if (!Memer.config.options.developers.includes(msg.author.id)) {
      return;
    }

    if (args[0] === 'help' || !args[0] || !commands[args[0]]) {
      return {
        fields: Object.keys(commands).map(c => ({ name: c, value: commands[c].help, inline: true })),
        footer: { text: 'shhh devs only' }
      };
    }

    return commands[args.shift()].fn({ Memer, msg, args });
  }, {
    triggers: ['dev', 'stupid-bot', 'd'],
    usage: '{command} you really don\'t need docs for this',
    description: 'henlo, u stinky birb',
    ownerOnly: true
  }
);
