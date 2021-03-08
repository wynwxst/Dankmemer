const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason;
    let channel = msg.args.resolveChannel();
    if (!channel) {
      return 'come on man give me a channel name or id';
    }
    if (channel.type !== 0) {
      return 'You need to provide a TEXT channel to me';
    }
    if (msg.args.isEmpty) {
      msg.channel.createMessage('for what reason (respond within 30s or bad mod)');
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3);
      if (prompt) {
        reason = prompt.content;
      } else {
        reason = 'No reason given';
      }
    } else {
      reason = msg.args.gather();
    }

    await addCD();
    let previousOverwrites = channel.permissionOverwrites.has(msg.channel.guild.id) ? channel.permissionOverwrites.get(msg.channel.guild.id) : { json: {}, allow: 0, deny: 0 };
    if (previousOverwrites.json.sendMessages === false) {
      return 'this channel is already locked ya doofus';
    }
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id);
    channel.createMessage(`**This channel has been locked.**\n${reason}`);
    channel.editPermission(msg.channel.guild.id, previousOverwrites.allow & ~2048, previousOverwrites.deny | 2048, 'role', reason)
      .then(() => {
        if (modlog) {
          Memer.bot.createMessage(modlog, `**${msg.author.username}#${msg.author.discriminator}** locked ${channel.name}`);
        }
        return msg.channel.createMessage(`\`${channel.name}\` has been locked down, no more normies`);
      })
      .catch(() => {
        msg.channel.createMessage(`looks like I dont have perms to lock \`${channel.name}\`, I guess I don't have the right permissions ¯\\_(ツ)_/¯`);
      });
  },
  {
    triggers: ['lock', 'lockdown', 'ld'],
    usage: '{command} [user] [reason]',
    description: 'Warning, this will remove send message permissions from @everyone if the bot has the correct permissions',
    modPerms: ['manageChannels']
  }
);
