exports.handle = function (packet) {
  if (packet.t === 'VOICE_SERVER_UPDATE') {
    this.lavalink.voiceServerUpdate(packet.d);
    this.bot.voiceConnections.voiceServerUpdate(packet.d);
  } else if (packet.t === 'VOICE_STATE_UPDATE') {
    this.lavalink.voiceStateUpdate(packet.d);
  }
};
