const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['porngif', 'porn'],
  description: 'Basically a porn video but with gifs',
  isNSFW: true,
  vMessage: 'Hey, at least you aren\'t dealing with viruses and ads. Be thankful.',

  title: 'Here, take some gifs ;)',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/Gifs',
  tokenKey: 'boobbot'
});
