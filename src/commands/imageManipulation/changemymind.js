const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['changemymind'],
  description: 'well come on change my mind',

  requiredArgs: 'You have to actually put some text in to change someone\'s mind',
  textLimit: 149,
  textOnly: true
});
