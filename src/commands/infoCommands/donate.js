const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async () => ({
    title: 'Donate to Dank Memer',
    description: 'Help fund Dank Memer to keep it alive and performing well, as well as earning some exclusive perks!\n\n[Patreon](https://www.patreon.com/dankmemerbot) - Monthly support\n\nIf you donate please remember to join [this server](https://discord.gg/ngy5hz9) and add Mel#0004 as a friend. Then send Mel a DM with your patreon name, and he will get you sorted out!',
    footer: { text: 'idk what to put here' }
  }), {
    triggers: ['donate', 'patreon', 'donut'],
    description: 'See how you can donate to the bot to support the development and get some sweet perks!',
    perms: ['embedLinks']
  }
)
