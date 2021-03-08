const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['group'],
  description: 'You need group therapy after this',
  isNSFW: true,

  title: 'Life is always better with more',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/group',
  tokenKey: 'boobbot'
});
