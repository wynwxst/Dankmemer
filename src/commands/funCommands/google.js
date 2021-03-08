const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  ({ cleanArgs }) => `http://lmgtfy.com/?q=${cleanArgs.join('+')}`,
  {
    missingArgs: 'Hey, what do you want me to google?',

    triggers: ['google', 'lmgtfy'],
    usage: '{command} search terms',
    description: 'Sick of someone asking dumb questions? LMGTFY it for them!'
  }
);
