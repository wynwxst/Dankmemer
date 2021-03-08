const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let { pocket } = await Memer.db.getUser(msg.author.id)
    let coins = pocket
    if (coins.coin === 0) {
      return { title: 'You have no coins.' }
    }
    await addCD()
    let coinFlip = Math.floor(Math.random() * 2) + 1
    const heads = 1
    const tails = 2

    msg.channel.createMessage('Call `heads` or `tails`\nYou have about 10 seconds before I give up.')

    const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 1e4)

    if (!choice) {
      return 'I flipped the coin, but you didn\'t call it in time!'
    } else if (choice.content.toLowerCase().includes('heads')) {
      if (coinFlip === heads) {
        await Memer.db.addPocket(msg.author.id, 1)
        return 'It was heads! You have been awarded one coin!'
      } else {
        return 'aw it was tails and you suck, sad day for you'
      }
    } else if (choice.content.toLowerCase().includes('tails')) {
      if (coinFlip === tails) {
        await Memer.db.addPocket(msg.author.id, 1)
        return 'It was tails! You have been awarded one coin!'
      } else {
        return 'aw it was heads and you suck, sad day for you'
      }
    } else {
      return 'You need to answer with heads or tails next time. Try the command again, stupid'
    }
  },
  {
    triggers: ['flip', 'coinflip'],
    cooldown: 3e5,
    donorCD: 2e5,
    description: 'Flip a coin, and if you call it you win it!'
  }
)
