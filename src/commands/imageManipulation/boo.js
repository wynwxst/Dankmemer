const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['boo'],
  description: 'AAHHHH',

  requiredArgs: 'You need to provide text for the ghost to say separated by a comma (,)',
  textLimit: [59, 59],
  textOnly: true
});
