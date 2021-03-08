const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['dpgirls'],
  description: 'Double penetration',
  isNSFW: true,

  title: 'double the fun',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/dpgirls',
  tokenKey: 'boobbot'
});
