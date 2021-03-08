const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD();

    const purgeAmount = Math.min(Math.max(msg.args.nextArgument() || 10, 1), 100);
    let filter = null;

    switch (msg.args.nextArgument()) {
      case 'bot':
      case 'bots': // clean messages from any bots
        filter = (m) => m.author.bot;
        break;

      case 'user':
      case 'users': // clean messages from all users (or those specified) - excludes bots
        const senders = msg.args.resolveUsers();
        if (senders.length > 0) {
          filter = (m) => senders.some(user => user.id === m.author.id);
        } else {
          filter = (m) => !m.author.bot;
        }
        break;

      case 'memer':
        filter = (m) => m.author.id === Memer.bot.user.id;
        break;
    }

    const deleted = await msg.channel.purge(purgeAmount, filter)
      .catch(err => err.message);

    if (typeof (deleted) === 'string') {
      return `Something went wrong while deleting the messages\n\`\`\`\n${deleted}\`\`\``;
    } else {
      let modlog = await Memer.db.fetchModlog(msg.channel.guild.id);
      if (modlog) {
        Memer.bot.createMessage(modlog, `**${msg.author.username}#${msg.author.discriminator}** Deleted ${deleted} messages in ${msg.channel.name}.`);
      }
      const success = await msg.channel.createMessage(`Deleted ${deleted} messages. Are ya happy now?`);
      await Memer.sleep(1500);
      return success.delete();
    }
  },
  {
    triggers: ['clean', 'purge', 'clear'],
    usage: '{command} [amount] [bots|users|memer] [users...]',
    description: 'Will quickly clean the last 10 messages, or however many you specify.',
    perms: ['manageMessages', 'readMessageHistory'],
    modPerms: ['manageMessages']
  }
);
