const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['sickban', 'sickfilth'],
  description: 'ban this nerd pls'
});
