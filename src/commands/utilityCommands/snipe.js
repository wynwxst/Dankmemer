const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let channel = msg.args.resolveChannel() || msg.channel;

    const cachedEntry = await Memer.redis.get(`deletedmsg-${msg.channel.guild.id}-${channel.id}`)
      .then(res => res ? JSON.parse(res) : undefined);
    if (!cachedEntry) {
      return 'There\'s nothing to snipe!';
    }
    await addCD();
    let { content } = cachedEntry;
    let user = Memer.bot.users.get(cachedEntry.userID);
    return {
      author:
        {
          name: `${user.username}#${user.discriminator}`,
          icon_url: user.dynamicAvatarURL()
        },
      description: content.length > 2048 ? `${content.slice(0, 2045)}...` : content,
      timestamp: new Date(cachedEntry.timestamp)
    };
  },
  {
    triggers: ['snipe', 'sniper'],
    usage: '{command} [channel]',
    description: 'Shows the last deleted message from a specified channel',
    perms: ['embedLinks']
  }
);
