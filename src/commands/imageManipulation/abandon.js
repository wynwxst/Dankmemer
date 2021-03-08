const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['abandon', 'disown'],
  usage: '{command} <something to make the baby say>',
  description: 'Disowned!',

  requiredArgs: 'You need to add something to make the baby say, try again.',
  textLimit: 60,
  textOnly: true
});
