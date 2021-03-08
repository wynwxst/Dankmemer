const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({Memer, msg, addCD}) => {
    let args = msg.args.args;
    await addCD();
    const emojis = [':first_place:', ':second_place:', ':third_place:'];
    let stats = await Memer.db.getStats();
    if (stats.clusters[stats.clusters.length - 1].uptime === 0) {
      return 'bot is still loading, hold ur horses damn';
    }
    if (args && args[0] === '-all') {
      const bigmeme = (id) => new Promise(resolve => {
        setTimeout(() => resolve({ id }), 1000);
        Memer.ipc.fetchUser(id)
          .then(resolve); // this is intentional and also stupid but still intentional
      });

      let pls = await Memer.redis.zrevrange(`pocket-leaderboard`, 0, 9, 'WITHSCORES');
      pls = Memer.paginateArray(pls, 2).map(entry => {
        return {
          id: entry[0],
          pocket: entry[1]
        };
      });
      pls = await Promise.all(pls.map(g => bigmeme(g.id).then(res => { return { ...res, pocket: g.pocket }; })));
      return {
        title: 'Top 10 Global Richest Users',
        description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.pocket.toLocaleString()} - ${u.username ? u.username + '#' + u.discriminator : 'LOL WHO DIS'}`).join('\n'),
        footer: { text: `Global Leaderboard` }
      };
    } else {
      let pls = [];
      const members = msg.channel.guild.members;
      const pipeline = Memer.redis.pipeline();
      for (const ok of members) {
        pipeline.zscore('pocket-leaderboard', ok[0]);
        pls.push(ok[0]);
      }
      const membersScore = await pipeline.exec();
      for (let i = 0; i < membersScore.length; i++) {
        pls[i] = {
          id: pls[i],
          pocket: membersScore[i][1] || 0
        };
      }
      pls = pls.filter(u => u.pocket > 0);
      pls = pls.sort((a, b) => b.pocket - a.pocket).slice(0, 5);
      pls = await Promise.all(pls.map(g => Memer.ipc.fetchUser(g.id).then(res => { return { ...res, pocket: g.pocket }; })));
      return {
        title: `richest users in this server`,
        description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.pocket.toLocaleString()} - ${u.username}#${u.discriminator}`).join('\n'),
        footer: { text: `${msg.channel.guild.name} | add -all to see global` }
      };
    }
  },
  {
    triggers: ['rich', 'richest', 'toponepercent'],
    description: 'see who the top 10 richest users are in your server, or globally!'
  }
);
