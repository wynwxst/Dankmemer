module.exports = {
  help: 'pay dank memer staff',
  fn: async ({ Memer, args, msg }) => {
    if (!Memer.config.options.owners.includes(msg.author.id)) {
      return 'Woah now, only my "Owners" can do this';
    }
    if (msg.channel.guild.id !== '397472167631257600') {
      return 'hey please only do this in memer server thanks';
    }
    let members = msg.channel.guild.members.filter(u => {
      return u.roles.includes('421905409872363530');
    });
    for (const member of members) {
      Memer.db.addPocket(member.id, 10000);
    }
    return `Anyone with staff role has been paid 10,000 meme coins (${members.length} paid)`;
  }
};
