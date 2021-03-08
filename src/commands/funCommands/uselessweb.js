const GenericCommand = require('../../models/GenericCommand');
const websites = require('../../assets/arrays/useless.json');

module.exports = new GenericCommand(
  async ({ Memer }) => {
    return Memer.randomInArray(websites);
  }, {
    triggers: ['uselessweb', 'randomsite'],
    description: 'See a random site from https://theuselessweb.com/',
    usage: '{command}'
  }
);
