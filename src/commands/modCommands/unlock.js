const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let channel = msg.args.resolveChannel() || msg.channel
    if (!channel) {
      return 'come on man give me a channel name or id'
    }

    await addCD()
    let previousOverwrites = channel.permissionOverwrites.get(msg.channel.guild.id)
    if (previousOverwrites.json.sendMessages === true || previousOverwrites.json.sendMessages === undefined) {
      return 'this channel is already unlocked ya doofus'
    }
    channel.editPermission(msg.channel.guild.id, previousOverwrites.allow | 2048, previousOverwrites.deny, 'role')
      .then(() => {
        channel.createMessage(`**This channel has been unlocked!**`)
        return msg.channel.createMessage(`\`${channel.name}\` was succesfully unlocked, let's see how long you'll survive`)
      })
      .catch(() => {
        msg.channel.createMessage(`looks like I dont have perms to unlock \`${channel.name}\`, I guess I don't have the right permissions ¯\\_(ツ)_/¯`)
      })
  },
  {
    triggers: ['unlock', 'removelock', 'ulock'],
    usage: '{command} [user] [reason]',
    description: 'Removes the lock from a channel by granting @everyone send message perms again',
    modPerms: ['manageChannels']
  }
)
