const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['humansgood'],
  description: 'Humans are good',

  requiredArgs: 'You need to provide text for this meme, something that humans are good for',
  textLimit: 44,
  textOnly: true
});
