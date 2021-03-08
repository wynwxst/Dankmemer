const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['blowjob', 'bj'],
  description: 'Blowjob, ok',
  isNSFW: true,

  title: 'what a bunch of cocksuckers, haha get it?',
  message: 'Free nudes thanks to boobbot & tom <3',
  JSONKey: 'url',
  donorOnly: true,
  reqURL: 'https://boob.bot/api/v2/img/blowjob',
  tokenKey: 'boobbot'
});
