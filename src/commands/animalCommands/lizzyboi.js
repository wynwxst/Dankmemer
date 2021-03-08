const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['lizzyboi', 'lizard', 'scales'],
  description: 'See some cute lizzybois!',
  message: 'what sound does a lizard make, pls send help',
  title: '🦎',
  reqURL: 'https://nekos.life/api/v2/img/lizard',
  JSONKey: 'url'
});
