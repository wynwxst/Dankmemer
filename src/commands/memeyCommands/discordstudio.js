const GenericCommand = require('../../models/GenericCommand');

const baseURL = 'https://discord.studio/comics/';
const editions = 2;

module.exports = new GenericCommand(
  async ({ Memer }) => {
    let num = Memer.randomNumber(1, editions);
    let comic = `${baseURL + num}.png`;
    return {
      image: { url: comic },
      title: `Discord Studio #${num}`,
      url: `https://discord.studio/`,
      description: 'Weekly / Bi-Weekly editions of a webcomic about Discord... whatever that means.',
      footer: { text: 'Go check out the site: https://discord.studio/' }
    };
  }, {
    triggers: ['discordstudio', 'dstudio'],
    description: 'Discord studio webcomic'
  }
);
