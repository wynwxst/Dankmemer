const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['pokeporn', 'ewitspokemonhavingsex'],
  description: 'Why tf would someone want pokeporn',
  isNSFW: true,

  title: 'PeekAtChu ;)',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  reqURL: 'https://boob.bot/api/v2/img/PokePorn',
  tokenKey: 'porn'
})
