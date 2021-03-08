const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['madethis'],
  description: 'I made this',

  doubleAvatar: true
});
