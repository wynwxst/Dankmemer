const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['hentai'],
  description: 'owo lewd',
  isNSFW: true,

  title: 'Here, take some real hentai.',
  message: 'Free nudes from nekos.life',
  JSONKey: 'url',
  reqURL: 'https://nekos.life/api/v2/img/Random_hentai_gif'
})
