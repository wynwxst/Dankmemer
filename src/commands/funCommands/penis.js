const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const { config } = Memer
    const target = msg.args.gather().toLowerCase() === 'me' ? msg.author : (msg.args.resolveUser(true) || msg.author)
    const name = target.nick || target.username
    return {
      title: 'peepee size machine',
      description: `${name}'s penis\n8${'='.repeat((Math.floor(Math.random() * 10) + 1) * ~~!config.devs.includes(target.id))}D`
    }
  },
  {
    triggers: ['penis', 'howbig', 'peepee', 'pickle'],
    description: 'how big peepee'
  }
)
