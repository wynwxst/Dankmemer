const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason;
    let user = msg.args.resolveUser();
    if (!user) {
      return 'hey dumb, give me a user to kick via tagging them or id';
    }
    if (user.id === msg.channel.guild.ownerID) {
      return 'do you really think I can kick the server owner? Learn how to discord, thanks';
    }
    if (user.id === Memer.bot.user.id) {
      return 'not gonna kick myself, thanks';
    }
    if (Memer.getHighestRolePos(msg.member) <= Memer.getHighestRolePos(msg.channel.guild.members.get(user.id))) {
      return 'come on are you really gonna try and kick someone who\'s got a higher (or equal) role than you smh';
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

    let kicked = user;
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id);
    await addCD();
    const hahayes = `${kicked.username}#${kicked.discriminator}`;
    Memer.bot.kickGuildMember(msg.channel.guild.id, kicked.id, `${reason} | kicked by ${msg.author.username}`)
      .then(() => {
        if (modlog) {
          Memer.bot.createMessage(modlog, `**${hahayes}** was kicked by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`);
        }
        return msg.channel.createMessage(`\`${hahayes}\` was kicked, rekt af`);
      })
      .catch(() => {
        msg.channel.createMessage(`looks like I dont have perms to kick \`${kicked.username}#${kicked.discriminator}\`, I guess I have a lower role than them ¯\\_(ツ)_/¯`);
      });
  },
  {
    triggers: ['kick', 'boot'],
    usage: '{command} [user] [reason]',
    description: 'Warning, this will kick your target if the bot has the correct permissions',
    modPerms: ['kickMembers']
  }
);
