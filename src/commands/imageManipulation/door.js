const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['door', 'kickdoor'],
  description: 'lol rekt'
});
