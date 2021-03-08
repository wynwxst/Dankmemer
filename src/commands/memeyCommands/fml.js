const GenericCommand = require('../../models/GenericCommand');
const cheerio = require('cheerio');

const indexes = {}; // TODO: Move to a better place?

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD();

    if (!indexes[msg.channel.guild.id] || indexes[msg.channel.guild.id].length === 0) {
      const data = await Memer.http.get('http://www.fmylife.com/random');

      if (!data || !data.ok) {
        return 'FML, couldn\'t find anything';
      }

      const foundStories = [];
      const parser = await cheerio.load(data.body);
      parser('p.block a')
        .filter((i, story) => story.children.length > 0 && story.children[0].data.trim().length > 1)
        .map((i, story) => foundStories.push(story.children[0].data.trim()));

      indexes[msg.channel.guild.id] = foundStories;
    }

    const story = indexes[msg.channel.guild.id].shift();

    return story;
  }, {
    triggers: ['fml', 'fuckmylife'],
    description: 'Think you\'re having a bad day?',
    cooldown: 3000
  }
);
