exports.handle = function (guild) {
  this.stats.guildsJoined++;
  this.ddog.increment('event.guildCreate');
  this.ddog.increment('total.guildsGained');
  const embed = {
    color: 12054271,
    description: this.intro,
    fields: [
      {name: 'Important Links', value: this.links}
    ],
    footer: { text: 'Enjoy the 200+ commands!' }
  };
  guild.channels.get(guild.channels.filter(c => c.type === 0).map(c => c.id)[0]).createMessage({ embed })
    .catch(() => {});
};
