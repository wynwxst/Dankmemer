const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const userStreak = await Memer.db.getStreak(msg.author.id)
    let streak = ~~userStreak.streak

    if (Date.now() - userStreak.time > 172800000) { // 24 hours, 2 days because one-day cooldown
      await Memer.db.resetStreak(msg.author.id)
      streak = 1
    } else {
      await Memer.db.addStreak(msg.author.id)
      streak += 1
    }

    let coinsEarned = 25
    const streakBonus = Math.round((0.02 * coinsEarned) * streak)
    if (streak > 1) {
      coinsEarned = coinsEarned + streakBonus
    }
    await Memer.db.addPocket(msg.author.id, coinsEarned)
    await addCD()

    return {
      title: `Here are your daily coins, ${msg.author.username}`,
      description: `**${coinsEarned} coins** were placed in your pocket.\n\nYou can get another 25 coins by voting! ([Click Here](https://discordbots.org/bot/memes/vote))`,
      thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
      footer: {text: `Streak: ${streak} days (+${streakBonus} coins)`}
    }
  },
  {
    triggers: ['daily', '24hr'],
    cooldown: 864e5,
    donorBlocked: true,
    cooldownMessage: 'I\'m not made of money dude, wait ',
    description: 'Get your daily injection of meme coins'
  }
)
