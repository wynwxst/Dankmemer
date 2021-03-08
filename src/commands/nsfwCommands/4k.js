const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['4k', 'HD', '4kporn'],
  description: 'See some 4k nudes!',
  isNSFW: true,

  title: 'Here, take some 4k porn.',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/4k',
  tokenKey: 'boobbot'
});
