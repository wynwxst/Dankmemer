const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['lesbian', 'girlongirl'],
  description: 'So apparently naked guys weren\'t enough for you. Have some girls.',
  isNSFW: true,
  voter: true,
  vMessage: 'Hey, at least you aren\'t dealing with viruses and ads. Be thankful.',

  title: 'Here, take some lesbian porn.',
  message: 'Free nudes thanks to boobbot <3',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/lesbians',
  tokenKey: 'porn'
})
