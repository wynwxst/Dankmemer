exports.handle = function (packet) {
  if (packet.t === 'VOICE_SERVER_UPDATE') {
    this.bot.voiceConnections.voiceServerUpdate(packet.d)
  }
}
