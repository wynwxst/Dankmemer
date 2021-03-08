const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['bottomless'],
  description: 'My dad use to walk around bottomless. It was nothing like this though.',
  isNSFW: true,

  title: 'Looks better without pants',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/bottomless',
  tokenKey: 'boobbot'
});
