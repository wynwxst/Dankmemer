const { GenericCommand } = require('../../models/')
let message
module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const chances = Math.floor(Math.random() * 5)
    if (chances === 0) {
      message = 'Looks like you didn\'t find any coins in the dumpster. At least you found some day old bread! 🍞'
    } else {
      message = `You found **${chances > 1 ? chances + ' coins' : chances + ' coin'}** in the dumpster!\nCongrats I think? Idk, all I know is that you smell bad now.`
    }
    await addCD()
    await Memer.db.addPocket(msg.author.id, chances)
    return {
      title: `${msg.author.username} searches in a dumpster for some coins...`,
      description: message
    }
  },
  {
    triggers: ['search', 'dumpsterdive'],
    cooldown: 3e5,
    donorBlocked: true,
    cooldownMessage: 'There is currently a homeless man eating from that dumpster, try again in ',
    description: 'haha ur poor so you have to search for coins in a dumpster hahaha'
  }
)
