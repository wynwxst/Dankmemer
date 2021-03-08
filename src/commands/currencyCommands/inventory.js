const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let user = msg.args.resolveUser(true)
    await addCD()
    if (user) {
      let { pocket, bank, items } = await Memer.db.getUser(user.id)
      return {
        title: `Here is ${user.username}'s inventory`,
        description: `**Their Pocket**: ${pocket.toLocaleString()} coins.\n**Bank Account**: ${bank.toLocaleString()} coins\n\n**Items Owned (Coming soon)**\nMemes: ${items.memes}\nSpinners: ${items.spin}\nTide Pods: ${items.tide}`,
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
        footer: { text: 'to see what upgrades they have, use the upgrades command' }
      }
    } else {
      let { pocket, bank, items } = await Memer.db.getUser(msg.author.id)
      return {
        title: `Here is your inventory, ${msg.author.username}`,
        description: `**Your Pocket**: ${pocket.toLocaleString()} coins\n**Bank Account**: ${bank.toLocaleString()} coins\n\n**Items Owned (Coming soon)**\nMemes: ${items.memes}\nSpinners: ${items.spin}\nTide Pods: ${items.tide}`,
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
        footer: { text: 'to see what upgrades you have, use the upgrades command' }
      }
    }
  },
  {
    triggers: ['inventory', 'bal', 'balance', 'coins', 'inv'],
    description: 'Check your coin/inv balance, or someone elses',
    perms: ['embedLinks']
  }
)
