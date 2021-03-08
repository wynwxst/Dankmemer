const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['wanted'],
  description: 'excuse me ur under arrest'
});
