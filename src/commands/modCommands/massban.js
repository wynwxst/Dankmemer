const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    const reasonMatcher = /(["'])(.*?[^\\])\1/m.exec(msg.args.args.join(' '))
    let reason = reasonMatcher ? reasonMatcher[2] : undefined
    msg.args.args = msg.args.args.join(' ').replace(reasonMatcher ? reasonMatcher[0] : '', '').trim().split(' ')

    let users = msg.args.resolveUsers()
    if (!users.length) {
      return 'hey dumb, give me a user (or multiple) to ban via tagging them or id'
    }
    for (let user of users) {
      if (user.id === msg.channel.guild.ownerID) {
        return 'do you really think I can ban the server owner? Learn how to discord, thanks'
      }
      if (user.id === Memer.bot.user.id) {
        return 'not gonna ban myself, thanks'
      }
    }
    if (!reason) {
      msg.channel.createMessage('for what reason (respond within 30s or bad mod)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        reason = prompt.content
      } else {
        reason = 'No reason given'
      }
    }

    await addCD()
    let promises = []
    let bannedUsers = []
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id)
    for (let banned of users) {
      promises.push(
        Memer.bot.banGuildMember(msg.channel.guild.id, banned.id, 1, `${reason} | banned by ${msg.author.username}`)
          .then(() => {
            if (modlog) {
              Memer.bot.createMessage(modlog, `**${banned.username}#${banned.discriminator}** was banned by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`)
            }
            bannedUsers.push(banned)
          })
          .catch(() => {
            msg.channel.createMessage(`I was unable to ban **${banned.username}#${banned.discriminator}**. Check that they don't have a higher role than me and try again`)
          })
      )
    }

    await Promise.all(promises)
    msg.channel.createMessage(`${bannedUsers.map(m => `**${m.username}#${m.discriminator}**`).join(', ')} ${bannedUsers.length > 1 ? 'were' : 'was'} banned, good fricken riddance`)
  },
  {
    triggers: ['massban', 'bigban'],
    usage: '{command} [reason] [users...]',
    description: 'Warning, this will ban your target if the bot has the correct permissions',
    modPerms: ['banMembers']
  }
)
