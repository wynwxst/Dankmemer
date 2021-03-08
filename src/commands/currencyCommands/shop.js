const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    return 'The shop will be available in an update coming very soon... Better save your coins!'
  },
  {
    triggers: ['shop'],
    cooldown: 1000,
    donorBlocked: true,
    description: 'Shop for some dank items and upgrades!'
  }
)
