const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let { bank, pocket, pls, upgrades } = await Memer.db.getUser(msg.author.id)
    if (msg.args.args[0]) {
      switch (msg.args.args[0].toLowerCase()) {
        case 'deposit':
          if (Number(msg.args.args[1]) && Number(msg.args.args[1]) <= pocket) {
            if (Number(msg.args.args[1]) + bank > 250 + (upgrades.vault * 100) + ((pls / 100) * 20)) {
              return `You can only hold ${Math.round(250 + (upgrades.vault * 100) + ((pls / 100) * 20))} coins in your bank right now. To hold more, use the bot more.`
            }
            if (Number(msg.args.args[1]) < 1 || !Number.isInteger(Number(Number(msg.args.args[1])))) {
              return 'Needs to be a whole number greater than 0'
            }
            await addCD()
            await Memer.db.addBank(msg.author.id, Number(msg.args.args[1]))
            await Memer.db.removePocket(msg.author.id, Number(msg.args.args[1]))
            return `${Number(msg.args.args[1])} coin[s] deposited.`
          } else {
            return `Your second argument should be a number and no more than what you have in your pocket (${pocket})`
          }
        case 'withdraw':
          if (Number(msg.args.args[1]) && Number(msg.args.args[1]) <= bank) {
            if (Number(msg.args.args[1]) < 1 || !Number.isInteger(Number(Number(msg.args.args[1])))) {
              return 'Needs to be a whole number greater than 0'
            }
            await addCD()
            await Memer.db.addPocket(msg.author.id, Number(msg.args.args[1]))
            await Memer.db.removeBank(msg.author.id, Number(msg.args.args[1]))
            return `${Number(msg.args.args[1])} coin[s] withdrawn.`
          } else {
            return `Your second argument should be a number and no more than what you have in your bank (${bank})`
          }
        default:
          return 'Hm, thats not how this command works, first argument should be deposit or withdraw'
      }
    } else {
      const db = await Memer.db.getGuild(msg.channel.guild.id)
      const prefix = db ? db.prefix : Memer.config.defaultPrefix
      return {
        title: `${msg.author.username}'s account:`,
        description: `**Current Balance**: ${bank}/${Math.round(250 + (upgrades.vault * 100) + ((pls / 100) * 20))}\nYou can deposit coins with \`${prefix} bank deposit #\`\nYou can withdraw coins with \`${prefix} bank withdraw #\``,
        footer: { text: 'You can earn more vault space by using the bot more often' }
      }
    }
  },
  {
    triggers: ['bank'],
    description: 'Check your account balance and make deposits or withdraws',
    perms: ['embedLinks']
  }
)
