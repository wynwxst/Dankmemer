const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['pawg'],
  description: 'phat ass white girl',
  isNSFW: true,

  title: 'damn girl!',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/pawg',
  tokenKey: 'porn'
})
