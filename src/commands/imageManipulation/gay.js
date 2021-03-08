const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['gay', 'gaypride', 'pride'],
  description: 'Show your gay pride!'
});
