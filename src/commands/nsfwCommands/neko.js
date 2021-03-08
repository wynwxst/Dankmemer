const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['neko', 'lewd'],
  description: 'owo lewd',
  isNSFW: true,

  title: 'Here, take some lewd nekos.',
  message: 'Free nudes from nekos.life',
  JSONKey: 'url',
  reqURL: 'https://nekos.life/api/v2/img/lewd'
})
