const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({Memer, msg, addCD}) => {
    let args = msg.args.args
    await addCD()
    const emojis = [':first_place:', ':second_place:', ':third_place:']
    let stats = await Memer.db.getStats()
    if (stats.clusters[stats.clusters.length - 1].uptime === 0) {
      return 'bot is still loading, hold ur horses damn'
    }
    if (args && args[0] === '-all') {
      const fetchUser = (id) => new Promise(resolve => {
        setTimeout(() => resolve({ id }), 1000)
        Memer.ipc.fetchUser(id)
          .then(resolve) // this is intentional and also stupid but still intentional
      })
      let pls = await Memer.db.topPocket()
      pls = await Promise.all(pls.map(async g => Object.assign(await fetchUser(g.id), { pocket: g.pocket })))
      return {
        title: 'Top 15 Global Richest Users',
        description: pls.map((u, i) => `${emojis[i] || '👏'} ${u.pocket.toLocaleString()} - ${u.username ? u.username + '#' + u.discriminator : (Memer.db.removeUser(u.id) && 'LOL WHO DIS')}`).join('\n'),
        footer: { text: `Global Leaderboard` }
      }
    } else {
      let members = msg.channel.guild.members.map((m) => m.id)
      let topMembers = await Memer.r.table('users')
        .orderBy(Memer.r.desc('pocket'))
        .filter((user) => Memer.r.expr(members).contains(user('id')))
        .limit(10)
        .run()
      topMembers = await Promise.all(topMembers.map(async g => Object.assign(await Memer.ipc.fetchUser(g.id), { pocket: g.pocket })))
      return {
        title: `richest users in this server`,
        description: topMembers.map((u, i) => `${emojis[i] || '👏'} ${u.pocket.toLocaleString()} - ${u.username}#${u.discriminator}`).join('\n'),
        footer: { text: `${msg.channel.guild.name} | add -all to see global` }
      }
    }
  },
  {
    triggers: ['rich', 'richest', 'toponepercent'],
    description: 'see who the top 10 richest users are in your server, or globally!'
  }
)
