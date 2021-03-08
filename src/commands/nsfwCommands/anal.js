const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['anal', 'asshole'],
  description: 'owo lewd',
  isNSFW: true,

  title: 'Does this mean ass > tits?',
  message: 'Free nudes from nekos.life',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/anal',
  tokenKey: 'porn'
})
