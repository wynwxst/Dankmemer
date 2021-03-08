const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['lesbian', 'girlongirl'],
  description: 'So apparently naked guys weren\'t enough for you. Have some girls.',
  isNSFW: true,

  title: 'Here, take some lesbian porn.',
  message: 'Free nudes thanks to boobbot <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/lesbians',
  tokenKey: 'boobbot'
});
