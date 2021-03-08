const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['black'],
  description: 'Black is back',
  isNSFW: true,

  title: 'yesss please',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/black',
  tokenKey: 'porn'
})
