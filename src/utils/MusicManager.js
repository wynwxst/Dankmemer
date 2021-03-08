const Music = require('../models/Music');

class MusicManager {
  constructor (client) {
    this.client = client;
    this._map = new Map();
  }

  get (id) {
    let val = this._map.get(id);
    if (!val) {
      val = new Music(this.client, id);
      this._map.set(id, val);
    }
    return val;
  }

  get lavalink () {
    return this.client.lavalink;
  }
}

module.exports = (opts) => new MusicManager(opts);
