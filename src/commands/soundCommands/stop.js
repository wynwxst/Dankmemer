const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID) {
      return 'I\'m not even in a voice channel?'
    }

    if (!Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
      await Memer.bot.leaveVoiceChannel(msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID)
      Memer.ddog.increment('vc.five')
      return 'hm, ok I\'ll stop.'
    }

    if (!msg.member.voiceState.channelID) {
      return 'You\'re not even in a voice channel, why should I listen to you'
    }

    if (msg.member.voiceState.channelID !== Memer.bot.voiceConnections.get(msg.channel.guild.id).channelID) {
      return 'You\'re not even in my voice channel, why should I listen to you'
    }

    if (!Memer.bot.voiceConnections.get(msg.channel.guild.id).ready) {
      return 'Smh you can\'t stop when I\'m not connected. Give me a chance to connect before you are rude and make me stop. 😠'
    }
    await Memer.bot.voiceConnections.get(msg.channel.guild.id).stopPlaying()
    await Memer.bot.leaveVoiceChannel(msg.channel.guild.members.get(Memer.bot.user.id).voiceState.channelID)
    await msg.channel.createMessage('okokok im leaving now, no need to be rude')
  }, {
    triggers: ['stop'],
    description: 'stop the music!!!!!'
  }
)
