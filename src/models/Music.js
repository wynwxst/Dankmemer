/** @typedef {import('lavalink').Player} Player
 * @typedef {import('lavalink').ClusterNode} Node
 * @typedef {import('eris').Guild} Guild
 * @typedef {import('eris').TextChannel} TextChannel
 * @typedef {import('eris').VoiceChannel} VoiceChannel
 * @typedef {import('lavalink').Status} PlayerStatus
 */

module.exports = class Music {
  constructor (client, guildID) {
    /** @type {import('../models/GenericCommand').Memer} */
    this.client = client;
    /** @type {String} The ID of the guild this player belongs to */
    this.id = guildID;
    /** @type {Boolean} Whether repeat is enabled on this player */
    this.loop = false;
    /** @type {Boolean} */
    this.preparing = false;
    /** @type {Array<Object>} The queue */
    this.queue = [];
    this.player.on('event', this._handleEvent.bind(this));
    /** @type {String} */
    this._channelID = null;
    /** @type {Promise|Boolean} Whether the player is ready */
    this.ready = this._loadQueue();
    this.vote = null;
    this.sfxautoplay = { enabled: false, host: null, type: null, name: null };
  }

  /**
   * Add a song to the queue
   * @param {Object} song The track resolved by lavalink
   * @param {Boolean} [unshift=false] Whether to push the song at the front of the queue, defaults to `false`
   * @returns {Promise<void>}
   */
  addSong (song, unshift, index) {
    if (unshift) {
      this.queue.unshift(song);
    } else if (index > -1) {
      this.queue.splice(index, 0, song);
    } else {
      this.queue.push(song);
    }
    return this._play();
  }

  /**
   * Start a vote to skip the current track
   * @param {String} voter The ID of the user who started the vote
   * @returns {Object}
   */
  startVote (voter) {
    this.vote = {
      voted: [voter],
      timeout: setTimeout(this._handleVoteTimeout.bind(this), 6e4)
    };
    return this.vote;
  }

  /**
   * Reset the ongoing vote
   * @returns {void}
   */
  resetVote () {
    clearTimeout(this.vote.timeout);
    this.vote = null;
  }

  /**
   * Reset the session, as in, stop playing, clear the queue and disable repeat
   * @returns {Promise<void>}
   */
  reset () {
    if (this.queue.length) {
      this.clear();
    }
    if (this.loop) {
      this.loop = false;
    }
    if (this.playing) {
      return this.stop();
    }
  }

  /**
   * Pause/resume the player
   * @param {Boolean} [boolean] Whether to pause, `false` is resuming. Defaults to `true`
   * @returns {Promise<void>}
   */
  pause (boolean = true) {
    return this.player.pause(boolean);
  }

  /**
   * Shuffle the queue
   * @returns {Array<Object>} The shuffled queue
   */
  shuffle () {
    return this._shuffle(this.queue);
  }

  /**
   * Removes the track at the given index from the queue
   * @returns {Array<Object>} An array containing the removed track
   */
  remove (index) {
    return this.queue.splice(index, 1);
  }

  /**
   * Clears the queue, except the now playing track
   * @returns {void}
   */
  clear () {
    this.queue.length = 1;
  }

  /**
   * Stops the playback
   * @returns {Promise<void>}
   */
  stop () {
    return this.player.stop();
  }

  /**
   * End the current session, makes memer leave the voice channel and save the queue
   * @returns {Promise<void>}
   */
  endSession () {
    this._saveQueue();
    this.client.musicManager._map.delete(this.id);
    this.player.leave();
    return this.player.destroy();
  }

  /**
   *
   * @param {Number} volume The volume to change to
   * @returns {Promise<void>}
   */
  volume (volume) {
    return this.player.setVolume(volume);
  }

  /**
   * Start playing
   * @param {{start: Number, end: Number}} [options] Optional options
   * @returns {Promise<void>}
   */
  async _play (options) {
    if (this.busy || !this.queue.length) {
      return;
    }
    this.preparing = true;
    const { track } = this.nowPlaying;
    await this.player.play(track, options);
    this.preparing = false;
  }

  _saveQueue () {
    if (this.queue[0]) {
      this.client.redis.set(`queue-${this.id}`, JSON.stringify(this.queue, 'EX', 60 * 60 * 24))
        .catch(() => {});
    } else {
      this.client.redis.del(`queue-${this.id}`)
        .catch(() => {});
    }
  }

  _handleVoteTimeout () {
    this.vote = null;
    return this._send(`The vote to skip the current song ended because not enough users voted in time`);
  }

  async _loadQueue () {
    const queue = await this.client.redis.get(`queue-${this.id}`)
      .catch(() => null);
    if (queue) {
      this.queue = JSON.parse(queue);
    }
    return true;
  }

  _handleEvent (event) {
    const shifted = this.queue.shift();
    if (event.type === 'TrackEndEvent') {
      return this._finished(event, shifted);
    } else if (event.type === 'TrackExceptionEvent') {
      return this._failed(event);
    } else {
      return this._stuck();
    }
  }

  _finished (event, shifted) {
    if (this.sfxautoplay.enabled) {
      return (async () => {
        let response = await this.client.redis.get(`cachedplaylist-${this.sfxautoplay.type}`)
          .then(res => res ? JSON.parse(res) : undefined);
        if (response) {
          let { tracks } = response;
          const song = this.client.randomInArray(tracks);
          await this.addSong(song, true);
          return this._play();
        }
      })();
    }
    if (this.vote) {
      this.resetVote();
      this._send(`The vote to skip the song \`${shifted.info.title}\` has been cancelled because the song just ended`);
    }
    if (this.loop && shifted) {
      this.queue.push(shifted);
    }
    if (this.queue.length === 0) {
      return this.player.leave();
    }
    return this._play();
  }

  _failed (event) {
    return this._send(`:rage: Something went wrong whilst playing the hecking song: \`${event.error}\`\nAutomatically skipped to the next song in the queue.`);
  }

  _stuck () {
    this._send('heck, something went wrong when playing the current track, sorry bout that\nAutomatically skipped to the next song in the queue.');
    return this._play();
  }

  _shuffle (queue) {
    let firstSong = queue.shift();
    let currentIndex = queue.length;
    let randomIndex;
    let temporaryValue;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = queue[currentIndex];
      queue[currentIndex] = queue[randomIndex];
      queue[randomIndex] = temporaryValue;
    }

    queue.unshift(firstSong);

    return queue;
  }

  _send (content) {
    const { channel } = this;
    return channel.createMessage(content).catch(() => null);
  }

  /** @type {Guild} The guild this player belongs to */
  get guild () {
    return this.client.bot.guilds.get(this.id);
  }

  /** @type {TextChannel} The channel on which the last command was ran */
  get channel () {
    return this.client.bot.guilds.get(this.id).channels.get(this._channelID);
  }

  /** @type {VoiceChannel} The voice channel memer is playing in */
  get voiceChannel () {
    const guild = this.client.bot.guilds.get(this.id);
    return guild.channels.get(guild.members.get(this.client.bot.user.id).voiceState.channelID);
  }

  set channel (id) {
    this._channelID = id;
  }

  /** @type {Boolean} Whether the player is busy */
  get busy () {
    return this.playing || this.paused || this.preparing;
  }

  /** @type {PlayerStatus} */
  get status () {
    return this.player.status;
  }

  /** @type {Boolean} */
  get playing () {
    return this.player.playing;
  }

  /** @type {Boolean} */
  get paused () {
    return this.player.paused;
  }

  /** @type {Player} */
  get player () {
    return this.client.lavalink.get(this.id);
  }

  /** @type {Node} */
  get node () {
    return this.player.node;
  }

  /** @type {Object} The track currently playing */
  get nowPlaying () {
    return this.queue[0];
  }
};
