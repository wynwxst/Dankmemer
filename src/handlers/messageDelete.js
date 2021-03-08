exports.handle = async function (msg) {
  const cachedEntry = await this.redis.get(`msg-${msg.id}`)
    .then(res => res ? JSON.parse(res) : undefined);
  if (!cachedEntry) {
    return;
  }
  this.ddog.increment('deletedMessages');
  this.redis.set(`deletedmsg-${cachedEntry.guildID}-${cachedEntry.channelID}`, JSON.stringify({ userID: cachedEntry.userID, content: cachedEntry.content, timestamp: cachedEntry.timestamp }), 'EX', 60 * 60);
};
