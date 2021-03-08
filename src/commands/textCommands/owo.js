const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  () => 'OwO',
  {
    triggers: ['owo'],
    description: 'owo whats this',
    perms: []
  }
);
