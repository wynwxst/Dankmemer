const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'Tags are only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot';
    }
    let tag = msg.args.gather();
    if (!tag) {
      return 'you need to give me a tag to post smh';
    }
    let allTags = await Memer.db.getAllTags(msg.channel.guild.id);
    let retrievedTag = allTags.filter(found => found.name.toLowerCase() === tag.toLowerCase());
    if (!retrievedTag[0]) {
      return 'There\'s no tag that exists under that name';
    }
    return retrievedTag[0].text;
  }, {
    triggers: ['tag'],
    description: 'Posts the contents of a tag',
    usage: '{command} [tag name]'
  }
);
