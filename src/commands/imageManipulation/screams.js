const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['screams'],
  description: 'WHY',

  doubleAvatar: true
});
