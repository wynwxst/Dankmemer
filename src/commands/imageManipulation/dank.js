const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['dank', '2dank4u', '3dank5u'],
  description: 'dank tbh',
  format: 'gif'
});
