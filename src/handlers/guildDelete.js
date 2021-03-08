exports.handle = function (guild) {
  if (guild.unavailable) {
    this.ddog.increment('event.guildunavailable');
    return;
  }
  this.stats.guildsLeft++;
  this.ddog.increment('event.guildDelete');
  this.ddog.decrement('total.guildsGained');
  this.db.deleteGuild(guild.id);
  this.db.deleteDevSubscriber(guild.id);
};
