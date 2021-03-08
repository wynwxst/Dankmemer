const { GenericImageCommand } = require('../../models/');

module.exports = new GenericImageCommand({
  triggers: ['knowyourlocation', 'kyl'],
  description: 'Dank Memer would like to know your location',

  requiredArgs: 'You need to text for the search bar and the thing requesting location, try again',
  textLimit: [44, 119],
  textOnly: true
});
