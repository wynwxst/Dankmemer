exports.handle = function (guild) {
  this.ddog.increment('event.guildDelete')
  this.ddog.decrement('total.guildsGained')
  this.db.deleteGuild(guild.id)
  this.db.deleteDevSubscriber(guild.id)
}
