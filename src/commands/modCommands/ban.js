const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason
    let user = msg.args.resolveUser()
    if (!user) {
      return 'hey dumb, give me a user to ban via tagging them or id'
    }
    if (user.id === msg.channel.guild.ownerID) {
      return 'do you really think I can ban the server owner? Learn how to discord, thanks'
    }
    if (user.id === Memer.bot.user.id) {
      return 'not gonna ban myself, thanks'
    }
    if (msg.args.isEmpty) {
      msg.channel.createMessage('for what reason (respond within 30s or bad mod)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        reason = prompt.content
      } else {
        reason = 'No reason given'
      }
    } else {
      reason = msg.args.args.join(' ')
    }

    let banned = user
    await addCD()
    const hahayes = `${banned.username}#${banned.discriminator}`
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id)
    Memer.bot.banGuildMember(msg.channel.guild.id, banned.id, 1, `${reason} | banned by ${msg.author.username}`)
      .then(() => {
        if (modlog) {
          Memer.bot.createMessage(modlog, `**${hahayes}** was banned by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`)
        }
        return msg.channel.createMessage(`\`${hahayes}\` was banned, good fricken riddance`)
      })
      .catch((err) => {
        msg.channel.createMessage(`looks like I dont have perms to ban \`${banned.username}#${banned.discriminator}\`, I guess I have a lower role than them ¯\\_(ツ)_/¯`)
      })
  },
  {
    triggers: ['ban', 'hackban'],
    usage: '{command} [user] [reason]',
    description: 'Warning, this will ban your target if the bot has the correct permissions',
    modPerms: ['banMembers']
  }
)
