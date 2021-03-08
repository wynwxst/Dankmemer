const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    const nicknameMatcher = /(["'])(.*?[^\\])\1/m.exec(msg.args.args.join(' ')) // quotation support
    let nickname = nicknameMatcher ? nicknameMatcher[2] : msg.args.args[0]
    if (nicknameMatcher) {
      msg.args.args = msg.args.args.join(' ').replace(nicknameMatcher[0], '').trim().split(' ')
    } else {
      msg.args.args.splice(0, 1)
    }

    let role = msg.args.resolveRole(true)
    if (!nickname) {
      msg.channel.createMessage('what name do you want to give to everyone? You can type `reset` to remove everyone\'s nickname if they have one. (respond in 30s)')
      const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3)
      if (prompt) {
        nickname = prompt.content
      } else {
        return 'Ok I guess we\'re not renaming anyone then'
      }
    }

    if (nickname.toLowerCase() === 'reset') {
      nickname = ''
    }

    await addCD()
    msg.channel.createMessage(`Now starting to mass nickname everyone to **${nickname}**`)
    let members = !role ? msg.channel.guild.members.filter(m => m) : msg.channel.guild.members.filter(m => m.roles.includes(role.id))
    const promises = []
    let failed = 0
    for (const member of members) {
      promises.push(
        member.edit({ nick: nickname }).catch(() => {
          failed++
        })
      )
    }

    await Promise.all(promises)
    msg.channel.createMessage(`Finished renaming ${members.length - failed} people to ${!nickname ? 'their stinky username' : `**${nickname}**`}.`)
    if (failed) {
      return `I failed to rename ${failed} people, possibly due to permissions.`
    }
  },
  {
    triggers: ['massnick', 'massname'],
    usage: '{command} [nickname] [role]',
    description: 'Warning, this will rename everyone on the server (or everyone with a specific role when provided) if the bot has the correct permissions',
    modPerms: ['manageGuild']
  }
)
