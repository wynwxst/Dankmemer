const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  () => '( ͡° ͜ʖ ͡°)',
  {
    triggers: ['lenny'],
    description: 'you know what lenny is, everyone does.',
    perms: []
  }
);
