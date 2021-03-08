const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['toys', 'sextoys'],
  description: 'Relive your childhood, except very different!',
  isNSFW: true,

  title: 'Where can I buy that??',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/toys',
  tokenKey: 'boobbot'
});
