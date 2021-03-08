const { GenericCommand } = require('.')
const { exists } = require('../utils/audioUtils.js')
const audioAssets = `${process.cwd()}/assets/audio/custom`

module.exports = class GenericSoundboardCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, addCD }) {
    const sfx = msg.args.nextArgument()

    if (!sfx) {
      return 'idk what you want me to play, try giving me a clip name?'
    }

    if (!await exists(`${audioAssets}/${msg.author.id}/${sfx}.opus`)) {
      return 'Now playing: silence. Jk, a clip with that name doesn\'t exist'
    }

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam')
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id)

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif')
    }

    if (Memer.bot.voiceConnections.has(msg.channel.guild.id)) {
      if (!Memer.bot.voiceConnections.get(msg.channel.guild.id).playing) {
        Memer.bot.voiceConnections.remove(Memer.bot.voiceConnections.get(msg.channel.guild.id))
      }
      if (this.cmdProps.skipIfPlaying && Memer.bot.voiceConnections.get(msg.channel.guild.id)) {
        Memer.bot.voiceConnections.get(msg.channel.guild.id).stopPlaying()
      } else {
        return this.cmdProps.existingConn
      }
    }

    await addCD()

    msg.channel.createMessage({embed: {title: 'Now Playing...', description: sfx}})

    const conn = await Memer.bot.joinVoiceChannel(msg.member.voiceState.channelID)
    conn.play(`${audioAssets}/${msg.author.id}/${sfx}.opus`, { format: 'ogg' })

    setTimeout(() => checkBorkVoice(Memer, msg.channel), 5000)

    conn.once('end', async () => {
      await Memer.bot.leaveVoiceChannel(conn.channelID) // TODO: Don't run this if it's being skipped
    })
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000,
        perms: ['addReactions']
      }, this.cmdProps)
    ).props
  }
}

async function checkBorkVoice (Memer, channel) {
  const voiceConnection = Memer.bot.voiceConnections.get(channel.guild.id)

  if (voiceConnection) {
    if (!voiceConnection.playing && voiceConnection.ready) {
      await Memer.bot.leaveVoiceChannel(voiceConnection.channelID)
      Memer.ddog.increment('leftVoice')
      return channel.createMessage('Hm, it seems that I am in the voice channel but not playing anything. I decided to leave')
    }
    return setTimeout(() => checkBorkVoice(Memer, channel), 10000)
  }
}
