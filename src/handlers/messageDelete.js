exports.handle = async function (msg) {
  if (!this.snipe) {
    this.snipe = {}
  }
  if (!this.snipe[msg.channel.guild.id]) {
    this.snipe[msg.channel.guild.id] = {}
  }
  if (msg.content) {
    this.snipe[msg.channel.guild.id][msg.channel.id] = { userID: msg.author.id, content: msg.content, timestamp: msg.timestamp }
  }
}
