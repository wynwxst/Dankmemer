const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['floor', 'theflooris'],
  usage: '{command} <something to make the floor>',
  description: 'the floor is using commands in the right channel',

  requiredArgs: 'You need to add something to make the floor, try again.',
  textLimit: 57
});
