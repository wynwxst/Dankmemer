const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    /*
    let args = msg.args.args
    let given
    let user
    if (Number(args[0])) {
      given = msg.args.nextArgument()
      user = msg.args.resolveUser(true)
    } else {
      given = args[1]
      user = msg.args.resolveUser()
    }
    if (!user) {
      return 'who r u giving coins to, dumb'
    }
    if (!given || !Number.isInteger(Number(given)) || isNaN(given)) {
      return 'you have to to actually share a number, dummy. Not ur dumb feelings'
    }
    given = Number(given)
    let giverCoins = await Memer.db.getCoins(msg.author.id)
    let takerCoins = await Memer.db.getCoins(user.id)

    if (given > giverCoins.coin) {
      return `You only have ${giverCoins.coin} coins, you can't share that many`
    }
    if (given < 0) {
      return 'You can\'t share 0 coins you dumb'
    }

    await addCD()
    await Memer.db.addCoins(user.id, given)
    await Memer.db.removeCoins(msg.author.id, given)
    return `You gave ${user.username} ${given.toLocaleString()} coins, now you have ${(giverCoins.coin - given).toLocaleString()} and they've got ${(takerCoins.coin + given).toLocaleString()}`
    */
    return 'sharing is not currently available. It will return with the shop update.'
  },
  {
    triggers: ['share', 'give'],
    cooldown: 1e3,
    donorCD: 1e3,
    description: 'share some coins with someone',
    missingArgs: 'You need to choose who to share with and how many coins dummy'
  }
)
