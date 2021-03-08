const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['brain', 'brains'],
  usage: '{command} <item 1, item 2, item 3, item 4>',
  description: 'idk what to put here tbh',

  requiredArgs: 'You need to include something to put on the 4 brain meme, try again',
  textLimit: 120,
  textOnly: true
});
