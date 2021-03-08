const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, cleanArgs }) => Memer.codeblock(cleanArgs.join(' '), 'css'), {
    triggers: ['greentext', '>', 'gt'],
    description: 'Make the bot say whatever you want with greentext',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'Give me something to greentext and try again'
  }
);
