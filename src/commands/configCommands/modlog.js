const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let perms = msg.channel.permissionsOf(msg.author.id)
    if (!perms.has('banMembers')) {
      return 'lol you do not have ban members perms and you know it'
    }
    let channel = msg.args.resolveChannel(false, false)
    if (channel) {
      let old = await Memer.db.fetchModlog(msg.channel.guild.id)
      if (!old) {
        await Memer.db.updateModlog(msg.channel.guild.id, channel.id)
        return `Ok, your modlog channel is now <#${channel.id}> now have fun abusing your mod powers`
      }
      await Memer.db.updateModlog(msg.channel.guild.id, channel.id)
      return `Oi, mr person with mod perms.\nYour old modlog channel was <#${old}>, your updated modlog channel is <#${channel.id}>`
    }
    await Memer.db.updateModlog(msg.channel.guild.id, 0)
    return `Ok since I did not detect a channel mention in this command, I'm gonna assume you wanted no modlog?\nMission accomplished I guess?`
  }, {
    triggers: ['modlog'],
    usage: '{command} [#channel]',
    description: 'Mention a channel to set/update a modlog channel, say literally anything else and remove an existing modlog channel'
  }
)
