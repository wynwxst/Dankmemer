const { GenericCommand } = require('../../models/')
const leet = require('../../utils/leetGenerator')

module.exports = new GenericCommand(
  async ({ cleanArgs }) => leet(cleanArgs.join(' ')).replace(/\\/g, '\\\\'),
  {
    triggers: ['leetify', 'leet', '1337'],
    description: 'B3C0M3 4N l337 h4X0R',
    usage: '{command} <what you want the bot to leetify>',

    missingArgs: 'You can\'t be a leet H4x0r if you don\'t tell me what to say'
  }
)
