const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['tats', 'tattoos'],
  description: 'women with tattoos',
  isNSFW: true,

  title: 'I have an "i love mom" tat',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/wtats',
  tokenKey: 'boobbot'
});
