const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let user = msg.args.resolveUser(true)
    if (user) {
      let { upgrades } = await Memer.db.getUser(user.id)
      await addCD()
      return {
        title: `Here is ${user.username}'s upgrades`,
        description: `**Multiplier Upgrades**: ${upgrades.multi}/5\n**Vault Upgrades**: ${upgrades.vault}/5\n**Share Upgrades**: ${upgrades.shares}/5\n**Luck Upgrades**: ${upgrades.luck}/5`,
        footer: { text: 'to see what they own, use the inventory command' }
      }
    } else {
      let { upgrades } = await Memer.db.getUser(msg.author.id)
      await addCD()
      return {
        title: `Here are your upgrades, ${msg.author.username}`,
        description: `**Multiplier Upgrades**: ${upgrades.multi}/5\n**Vault Upgrades**: ${upgrades.vault}/5\n**Share Upgrades**: ${upgrades.shares}/5\n**Luck Upgrades**: ${upgrades.luck}/5`,
        footer: { text: 'to see what you own, use the inventory command' }
      }
    }
  },
  {
    triggers: ['upgrades', 'ups'],
    description: 'Check your upgrades, or someone elses',
    perms: ['embedLinks']
  }
)
