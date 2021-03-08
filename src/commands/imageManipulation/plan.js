const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['plan', 'gru'],
  usage: '{command} <item 1, item 2, item 3>',
  description: 'idk what to put here tbh',

  requiredArgs: 'You need to include three things separated by commas. Such as `pls plan ur, mom, gay`, try again',
  textLimit: 100,
  textOnly: true
});
