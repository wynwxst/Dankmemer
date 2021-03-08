const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer }) => {
    let data = await Memer.http.get('https://www.carbonitex.net/discord/api/listedbots')
    let list = data.body.sort(function (a, b) {
      return b.servercount - a.servercount
    })
    list.length = 10
    let final = list.map(m => `[${list.indexOf(m) + 1 === 10 ? list.indexOf(m) + 1 : '0' + (list.indexOf(m) + 1)}] ${m.name} : ${Number(m.servercount).toLocaleString()} servers`)
    return '```ini\n' + final.join('\n') + '\n```'
  },
  {
    triggers: ['botlist', 'topbots', 'carbon'],
    description: 'Top bots listed on carbonitex'
  }
)
