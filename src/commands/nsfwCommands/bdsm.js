const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['bdsm'],
  description: 'I do not like to be dominated, but these people do',
  isNSFW: true,

  title: 'I bet you like that',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/bdsm',
  tokenKey: 'porn'
})
