const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ cleanArgs }) => {
    return cleanArgs.join(' ').split('').map(char => {
      const code = char.charCodeAt(0);
      return code >= 33 && code <= 126 ? String.fromCharCode((code - 33) + 65281) : char;
    }).join('');
  }, {
    triggers: ['vaporwave', 'aesthetics'],
    description: 'Make the bot say whatever you want with a bit of weeb',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say in weeb speak?'
  }
);
