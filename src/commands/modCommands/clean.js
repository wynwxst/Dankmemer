const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD()

    const purgeAmount = Math.min(Math.max(msg.args.nextArgument() || 10, 1), 100)
    let filter = null

    switch (msg.args.nextArgument()) {
      case 'bot':
      case 'bots': // clean messages from any bots
        filter = (m) => m.author.bot
        break

      case 'user':
      case 'users': // clean messages from all users (or those specified) - excludes bots
        const senders = msg.args.resolveUsers()
        if (senders.length > 0) {
          filter = (m) => senders.some(user => user.id === m.author.id)
        } else {
          filter = (m) => !m.author.bot
        }
        break

      default: // No arguments/matches, default to cleaning Memer's messages
        filter = (m) => m.author.id === Memer.bot.user.id
    }

    const deleted = await msg.channel.purge(purgeAmount, filter)
      .catch(err => err.message)

    if (typeof (deleted) === 'string') {
      return `Something went wrong while deleting the messages\n\`\`\`\n${deleted}\`\`\``
    } else {
      const success = await msg.channel.createMessage(`Deleted ${deleted} messages. Are ya happy now?`)
      await Memer.sleep(1500)
      return success.delete()
    }
  },
  {
    triggers: ['clean', 'purge', 'clear'],
    usage: '{command} [amount] [bots|users] [users...]',
    description: 'Will quickly clean the last 10 messages, or however many you specify.',
    perms: ['manageMessages', 'readMessageHistory'],
    modPerms: ['manageMessages']
  }
)
