const { GenericModerationCommand } = require('../../models/')

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let channel = msg.args.resolveChannel()
    if (!channel) {
      return 'hey dumb, give me a voice channel to kick people from'
    }
    if (channel.type !== 2) {
      return 'listen buddy give me a VOICE channel to kick people from'
    }

    await addCD()
    const hahayes = `Voicekick by ${msg.author.username}#${msg.author.discriminator}`
    msg.channel.guild.createChannel(channel.name, channel.type, hahayes, channel.parentID)
      .then(async (newchannel) => {
        await Memer.sleep(100)
        await newchannel.editPosition(channel.position)
        await newchannel.edit({bitrate: channel.bitrate, userLimit: channel.userLimit})
        let promises = []
        for (let permission of channel.permissionOverwrites.map(m => m)) {
          promises.push(newchannel.editPermission(permission.id, permission.allow, permission.deny, permission.type, hahayes))
        }
        await Promise.all(promises).then(() => {
          channel.delete(hahayes)
          msg.channel.createMessage(`there goes all those smelly people in **${newchannel.name}**`)
        })
      })
      .catch((err) => {
        msg.channel.createMessage(`looks like I dont have perms to recreate this channel, I guess it's private or I'm missing the \`Manage Channels\` permission ¯\\_(ツ)_/¯`)
      })
  },
  {
    triggers: ['voicekick', 'vckick'],
    usage: '{command} [channel]',
    description: 'Warning, this will recreate the target voice channel if the bot has the correct permissions',
    modPerms: ['manageChannels']
  }
)
