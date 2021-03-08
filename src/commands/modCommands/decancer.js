const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    const cancerSearcher = /^[^\w\s\d]/
    let nickname = msg.args.args.join(' ') || 'cancer name'
    if (nickname.length > 32 || nickname.length < 1) {
      return `The nickname you provided was too long or too short (${nickname.length} characters)`
    }
    if (cancerSearcher.exec(nickname)) {
      return 'well that\'s a bit pointless, renaming all the cancerous names to ANOTHER cancerous name?!'
    }
    await addCD()
    let members = msg.channel.guild.members.filter(u => {
      return cancerSearcher.exec(u.nick || u.username)
    })
    const promises = []
    let failed = 0
    for (const member of members) {
      promises.push(
        member.edit({ nick: nickname }).catch(() => {
          failed++
        })
      )
    }

    if (!promises[0]) {
      return `There's nobody with a cancerous name, what a great day!`
    }

    await Promise.all(promises)
    msg.channel.createMessage(`Finished renaming ${members.length - failed} people with cancer names`)
    if (failed) {
      return `I failed to rename ${failed} people, check that they don't have a higher role than me and try again`
    }
  },
  {
    triggers: ['decancer', 'uncancer', 'dehoist'],
    usage: '{command} [nickname] [role]',
    description: 'Warning, this will rename any people with crappy/annoying special characters in their name if the bot has the correct permissions',
    modPerms: ['manageNicknames']
  }
)
