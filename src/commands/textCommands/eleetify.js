const GenericCommand = require('../../models/GenericCommand');
const leet = require('../../utils/leetGenerator');

module.exports = new GenericCommand(
  async ({ cleanArgs }) => leet(cleanArgs.join(' '), true).replace(/\\/g, '\\\\'),
  {
    triggers: ['eleetify', 'eleet', '31337'],
    description: '83<0|\\/|3 4 31337 |-|4<|<3.-',
    usage: '{command} <what you want the bot to eleetify>',

    missingArgs: 'You can\'t be a 31337 |-|a><0.- if you don\'t tell me what to say'
  }
);
