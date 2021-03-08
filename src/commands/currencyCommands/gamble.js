const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let user = msg.author
    let userDB = await Memer.db.getUser(user.id)
    let donor = await Memer.db.checkDonor(user.id)
    let multi = await Memer.calcMultiplier(Memer, user, userDB, donor, msg)
    let coins = userDB.pocket

    let bet = msg.args.args[0]
    if (!bet) {
      return 'You need to bet something.'
    }
    if (bet < 1 || !Number.isInteger(Number(bet))) {
      return 'Needs to be a whole number greater than 0'
    }
    if (isNaN(bet)) {
      if (bet === 'all') {
        bet = coins
      } else if (bet === 'half') {
        bet = Math.round(coins / 2)
      } else {
        return 'You have to bet actual coins, dont try to break me.'
      }
    }
    if (coins === 0) {
      return 'You have no coins.'
    }
    if (bet > coins) {
      return `You only have ${coins.toLocaleString()} coins, dont bluff me.`
    }

    await addCD()
    let blahblah = Math.random()

    if (blahblah > 0.95) {
      let winAmount = Math.random() + 0.8
      let random = Math.round(Math.random())
      winAmount = winAmount + random
      let winnings = Math.round(bet * winAmount)
      winnings = winnings + Math.round(winnings * (multi / 100))
      if (winnings === bet) {
        return 'You broke even. This means you\'re lucky I think?'
      }

      await Memer.db.addPocket(msg.author.id, winnings)
      return `You won **${winnings.toLocaleString()}** coins. \n**Multiplier**: ${multi}% | **Percent of bet won**: ${winnings.toFixed(2) * 100}%`
    } else if (blahblah > 0.90) {
      let winAmount = Math.random() + 0.4
      let winnings = Math.round(bet * winAmount)
      winnings = winnings + Math.round(winnings * (multi / 100))
      if (winnings === bet) {
        return 'You broke even. This means you\'re lucky I think?'
      }

      await Memer.db.addPocket(msg.author.id, winnings)
      return `You won **${winnings.toLocaleString()}** coins. \n**Multiplier**: ${multi}% | **Percent of bet won**: ${winAmount.toFixed(2) * 100}%`
    } else {
      await Memer.db.removePocket(msg.author.id, bet)
      return `You lost **${Number(bet).toLocaleString()}** coins.`
    }
  },
  {
    triggers: ['gamble', 'bet'],
    cooldown: 3e3,
    donorCD: 2e3,
    description: 'Take your chances at gambling. Warning, I am very good at stealing your money.',
    cooldownMessage: 'If I let you bet whenever you wanted, you\'d be a lot more poor. Wait ',
    missingArgs: 'You gotta gamble some of ur coins bro, `pls gamble #/all/half` for example, dummy'
  }
)
