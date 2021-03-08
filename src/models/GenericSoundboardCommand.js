/** @typedef {import('./GenericCommand').CommandProps} CommandProps */

const GenericCommand = require('./GenericCommand');
const { exists } = require('../utils/audioUtils.js');
const audioAssets = `${process.cwd()}/assets/audio/custom`;

module.exports = class GenericSoundboardCommand {
  /**
   * @param {CommandProps} cmdProps
   */
  constructor (cmdProps) {
    this.cmdProps = cmdProps;
  }

  async run ({ Memer, msg, addCD }) {
    const sfx = msg.args.nextArgument();
    const music = Memer.musicManager.get(msg.channel.guild.id);

    if (!sfx) {
      return 'idk what you want me to play, try giving me a clip name?';
    }

    if (!await exists(`${audioAssets}/${msg.author.id}/${sfx}.opus`)) {
      return 'Now playing: silence. Jk, a clip with that name doesn\'t exist';
    }

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam');
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id);

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif');
    }

    if (music.voiceChannel) {
      if (!music.playing) {
        await music.reset();
      }
      if (this.cmdProps.skipIfPlaying && music.playing) {
        await music.reset();
      }
      if (music.playing && !this.cmdProps.skipIfPlaying) {
        return this.cmdProps.existingConn;
      }
    }

    await addCD();

    msg.channel.createMessage({embed: {title: 'Now Playing...', description: sfx}});

    await music.player.join(msg.member.voiceState.channelID);
    await music.ready;
    if (music.queue[0]) {
      music.queue = [];
    }
    let response = await music.node.load(encodeURIComponent(`http://${Memer.config.webhookServer.host}:${Memer.config.webhookServer.port}/audio/custom/${msg.author.id}/${sfx}?token=${Memer.secrets.memerServices.webhookServer}`));
    const { tracks } = response;
    if (!tracks[0]) {
      return 'Seems like this didn\'t work, sad.';
    }
    await music.addSong(tracks[0]);
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000,
        perms: ['addReactions']
      }, this.cmdProps)
    ).props;
  }
};
