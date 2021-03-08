const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['fedora', 'tip'],
  description: 'lol rekt'
});
