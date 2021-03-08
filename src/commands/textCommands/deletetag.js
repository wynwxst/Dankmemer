const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'Tags are only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot';
    }
    if (!Memer.bot.getChannel(msg.channel.id).permissionsOf(msg.author.id).has('banMembers')) {
      return 'Only people with `Ban Members` can remove tags.';
    }
    const tagName = msg.args.args[0];
    let results = await Memer.db.getTag(msg.channel.guild.id, tagName);
    if (!results) {
      return 'There is no tag with that name';
    }
    Memer.db.removeTag(msg.channel.guild.id, tagName);
    return `Successfully removed tag **${tagName}**`;
  }, {
    triggers: ['deletetag', 'deltag'],
    description: 'Deletes an existing tag',
    usage: '{command} [tag name]'
  }
);
