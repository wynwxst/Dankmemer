const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['booty', 'ass'],
  description: 'Come get you some ass.',
  isNSFW: true,
  voter: true,
  vMessage: 'Hey, at least you aren\'t dealing with viruses and ads. Be thankful.',

  title: 'Here, take some booty.',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/ass',
  tokenKey: 'porn'
})
