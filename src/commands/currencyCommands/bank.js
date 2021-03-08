const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let { bank, pocket, pls } = await Memer.db.getUser(msg.author.id);
    const amount = Number(msg.args.args[1]);
    if (msg.args.args[0]) {
      switch (msg.args.args[0].toLowerCase()) {
        case 'deposit':
          if (amount && amount <= pocket) {
            if (amount + bank > 500 + ((pls / 100) * 150)) {
              return `You can only hold ${Math.round(500 + ((pls / 100) * 150))} coins in your bank right now. To hold more, use the bot more.`;
            }
            if (amount < 1 || !Number.isInteger(Number(amount))) {
              return 'Needs to be a whole number greater than 0';
            }
            await addCD();
            await Memer.db.addBank(msg.author.id, amount);
            return `${amount} coin${amount === 1 ? '' : 's'} deposited.`;
          } else {
            return `Your second argument should be a number and no more than what you have in your pocket (${pocket})`;
          }
        case 'withdraw':
          if (amount && amount <= bank) {
            if (amount < 1 || !Number.isInteger(Number(amount))) {
              return 'Needs to be a whole number greater than 0';
            }
            await addCD();
            await Memer.db.removeBank(msg.author.id, amount);
            return `${amount} coin${amount === 1 ? '' : 's'} withdrawn.`;
          } else {
            return `Your second argument should be a number and no more than what you have in your bank (${bank})`;
          }
        default:
          return 'Hm, thats not how this command works, first argument should be deposit or withdraw';
      }
    } else {
      await addCD();
      const db = await Memer.db.getGuild(msg.channel.guild.id);
      const prefix = db ? db.prefix : Memer.config.options.prefix;
      return {
        title: `${msg.author.username}'s account:`,
        description: `**Current Balance**: ${bank}/${Math.round(500 + ((pls / 100) * 150))}\nYou can deposit coins with \`${prefix} bank deposit #\`\nYou can withdraw coins with \`${prefix} bank withdraw #\``,
        footer: { text: 'You can earn more vault space by using the bot more often' }
      };
    }
  },
  {
    triggers: ['bank'],
    description: 'Check your account balance and make deposits or withdraws',
    perms: ['embedLinks']
  }
);
