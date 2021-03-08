const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['balloon'],
  description: 'You can\'t pop this balloon',

  requiredArgs: 'You need to provide text to put on the balloon meme separated by a comma (,)',
  textLimit: [34, 19],
  textOnly: true
});
