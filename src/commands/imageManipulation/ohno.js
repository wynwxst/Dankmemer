const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['ohno', 'retarded'],
  usage: '{command} <something to say>',
  description: 'oh no',

  requiredArgs: 'You need to add something to make the dog say, try again.',
  textLimit: 159,
  textOnly: true
});
