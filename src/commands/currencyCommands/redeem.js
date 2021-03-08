const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const multiplier = await Memer.db.checkDonor(msg.author.id)
    const winnings = Number(multiplier) * 25
    await addCD()
    await Memer.db.addPocket(msg.author.id, winnings)
    return {
      title: `${msg.author.username} has redeemed their monthly donor rewards!`,
      description: `You donated $${multiplier}, so you get ${winnings.toLocaleString()} coins!\nThank you for your support!`
    }
  },
  {
    triggers: ['redeem'],
    donorCD: 2592e6,
    donorOnly: true,
    cooldownMessage: 'You have to wait ',
    description: 'redeem your cool donor reward monthly'
  }
)
