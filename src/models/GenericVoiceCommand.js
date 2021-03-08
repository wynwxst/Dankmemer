/** @typedef {import('./GenericCommand').CommandProps} CommandProps
 * @typedef {import('./GenericCommand').FunctionParams} FunctionParams
 */

const GenericCommand = require('./GenericCommand');
module.exports = class GenericVoiceCommand {
  /**
   * @param {CommandProps} cmdProps
   */
  constructor (cmdProps) {
    this.cmdProps = cmdProps;
  }

  /** @param {FunctionParams} */
  async run ({ Memer, msg, args, addCD }) {
    const music = Memer.musicManager.get(msg.channel.guild.id);
    let response = await Memer.redis.get(`cachedplaylist-${this.cmdProps.dir}`)
      .then(res => res ? JSON.parse(res) : undefined);
    if (!response) {
      response = await music.node.load(encodeURIComponent(`${Memer.config.links.youtube[this.cmdProps.dir]}`));
      Memer.redis.set(`cachedplaylist-${this.cmdProps.dir}`, JSON.stringify(response));
    }

    let { tracks } = response;

    if (!tracks[0]) {
      return 'Seems like this didn\'t work, sad.';
    }

    if (args.includes('-list')) {
      return `You can find a list of all the songs used in \`${this.props.triggers[0]}\` here:\n${Memer.config.links.youtube[this.cmdProps.dir]}`;
    }

    if (music.sfxautoplay.enabled && msg.member !== music.sfxautoplay.host) {
      return `You can't play anything right now because **${music.sfxautoplay.host.user.username}** has started a \`${music.sfxautoplay.name}\` autoplay session. Tracks from \`${music.sfxautoplay.name}\` will continuously play until the host leaves, or someone stops the music using \`pls stop\``;
    }

    await addCD();

    const song = Memer.randomInArray(tracks);

    if (args.length) {
      // Repeat function
      let donor = await Memer.db.checkDonor(msg.author.id);
      if ((args.includes('-autoplay') || args.includes('-repeat')) && donor) {
        music.sfxautoplay = { enabled: true, host: msg.member, type: this.cmdProps.dir, name: this.props.triggers[0] };
        if (!music.queue.length) {
          await music.addSong(song, true);
        } else {
          await music.addSong(song, false, 1);
          await music.stop();
        }
        await Memer.sleep(150);
        await music.player.join(msg.member.voiceState.channelID);
        await Memer.sleep(150);
        await music._play();
        return `nice, ${this.props.triggers[0]} songs will keep playing until you leave the channel or stop the music\nYou can also just use \`pls ${this.props.triggers[0]}\` again to turn this off`;
      } else if ((args.includes('-autoplay') || args.includes('-repeat')) && donor) {
        return 'Only donors have access to this feature.';
      } else {
        // Search
        tracks = tracks.filter(track => track.info ? track.info.title.toLowerCase().includes(args.join(' ').toLowerCase()) : track);
        if (!tracks.length) {
          return 'your search returned no results damn';
        }
      }
    }

    if (this.cmdProps.soundboard) {
      if (args.length === 0) {
        return 'You need to specify which sfx to play.\nChoose one from here: <https://goo.gl/X6EyRq>';
      }
      let file = args.join(' ').toLowerCase();
      if (!this.files.includes(`${file}.opus`)) return 'That isnt an option...\nChoose one from here: <https://goo.gl/X6EyRq>';
    }

    if (!msg.member.voiceState.channelID) {
      return msg.reply('join a voice channel fam');
    }

    const perms = Memer.bot.getChannel(msg.member.voiceState.channelID).permissionsOf(Memer.bot.user.id);

    if (!perms.has('voiceConnect') || !perms.has('voiceSpeak') || !perms.has('voiceUseVAD')) {
      return msg.reply('Make sure I have `connect`, `speak`, and `use voice activity` permissions in the channel settings so I can do this command!\n\nHow to do that: https://i.imgur.com/ugplJJO.gif');
    }

    music.sfxautoplay = { enabled: false, host: null, type: null, name: null };
    if (this.cmdProps.np) {
      msg.channel.createMessage({ embed: { title: 'Now Playing...', description: song.info.title } });
    } else if (this.cmdProps.message) {
      msg.channel.createMessage(this.cmdProps.message);
    }

    music.channel = msg.channel.id;
    if (!music.queue.length) {
      await music.addSong(song, true);
    } else {
      await music.addSong(song, false, 1);
      await music.stop();
    }
    await Memer.sleep(150);
    await music.player.join(msg.member.voiceState.channelID);
    await Memer.sleep(150);
    await music._play();
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000
      }, this.cmdProps)
    ).props;
  }
};
