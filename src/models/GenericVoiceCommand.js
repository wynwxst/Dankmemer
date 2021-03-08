const { GenericCommand } = require('.')
const fs = require('fs')
const audioAssets = `${process.cwd()}/assets/audio`
module.exports = class GenericVoiceCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
    this.files = fs.readdirSync(`${audioAssets}/${this.cmdProps.dir}`)
  }

  async run ({ Memer, msg, args, addCD }) {
    let file = typeof this.cmdProps.files === 'string'
      ? this.cmdProps.files
      : Memer.randomInArray(this.files).replace(/(\.opus)|(\.ogg)/, '')

    if (this.cmdProps.soundboard) {
      if (args.length === 0) {
        return 'You need to specify which sfx to play.\nChoose one from here: <https://goo.gl/X6EyRq>'
      }
      file = args.join(' ').toLowerCase()
      if (!this.files.includes(`${file}.opus`)) return 'That isnt an option...\nChoose one from here: <https://goo.gl/X6EyRq>'
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

    if (this.cmdProps.np) {
      let np = file.replace(/_+/g, ' ')
      msg.channel.createMessage({embed: {title: 'Now Playing...', description: np}})
    } else if (this.cmdProps.message) {
      msg.channel.createMessage(this.cmdProps.message)
    } else {
      msg.addReaction(this.cmdProps.reaction)
    }

    const conn = await Memer.bot.joinVoiceChannel(msg.member.voiceState.channelID)
    conn.play(`${audioAssets}/${this.cmdProps.dir}/${file}.opus`, { format: 'ogg' })

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
