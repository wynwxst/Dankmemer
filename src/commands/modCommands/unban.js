const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let reason
    let id = msg.args.args[0]
    if (!id) {
      return 'aye, ur gonna need to give me an id buddy'
    }
    msg.args.args.splice(0, 1)

    if (msg.args.isEmpty) {
      msg.channel.createMessage('for what reason (respond within 30s or bad mod)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        reason = prompt.content
      } else {
        reason = 'No reason given'
      }
    } else {
      reason = msg.args.gather()
    }

    await addCD()
    msg.channel.guild.getBan(id)
      .then(async (ban) => {
        let modlog = await Memer.db.fetchModlog(msg.channel.guild.id)
        msg.channel.guild.unbanMember(ban.user.id, `${reason} | unbanned by ${msg.author.username}`)
          .then(() => {
            const hahayes = `${ban.user.username}#${ban.user.discriminator}`
            if (modlog) {
              Memer.bot.createMessage(modlog, `**${hahayes}** was unbanned by **${msg.author.username}#${msg.author.discriminator}**\nReason: *${reason}*`)
            }
            return msg.channel.createMessage(`**${hahayes}** has been granted back into the server, for better or for worse`)
          })
          .catch(() => {
            msg.channel.createMessage('I wasn\'t able to unban that person for some reason, check that i\'ve got the correct permissions and try again')
          })
      })
      .catch((err) => {
        if (err.message.toString() === 'DiscordRESTError [10026]: Unknown Ban') {
          msg.channel.createMessage('that person isn\'t even banned lol')
        } else {
          msg.channel.createMessage('That user doesn\'t seem to exist? Make sure the ID you put in is a **valid** user ID and try again')
        }
      })
  },
  {
    triggers: ['unban', 'removeban', 'rmban'],
    usage: '{command} [id] [reason]',
    description: 'Unbans any person who has previously been banned from this server. Requires a valid user ID',
    modPerms: ['banMembers']
  }
)
