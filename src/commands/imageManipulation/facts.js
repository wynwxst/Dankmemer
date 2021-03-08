const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['facts', 'fact'],
  usage: '{command} <something to make the fact book say>',
  description: 'It is just a fact bro',

  requiredArgs: 'You need to add something to make the fact book say, try again.',
  textLimit: 125,
  textOnly: true
});
