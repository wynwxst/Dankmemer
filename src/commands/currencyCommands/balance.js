const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let user = msg.args.resolveUser(true);
    await addCD();
    if (user) {
      let { pocket, bank } = await Memer.db.getUser(user.id);
      return {
        title: `Here is ${user.username}'s balance`,
        description: `**Their Pocket**: ${pocket.toLocaleString()} coins.\n**Bank Account**: ${bank.toLocaleString()} coins`,
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'},
        footer: { text: 'to see what upgrades they have, use the upgrades command' }
      };
    } else {
      let { pocket, bank } = await Memer.db.getUser(msg.author.id);
      return {
        title: `Here is your balance, ${msg.author.username}`,
        description: `**Your Pocket**: ${pocket.toLocaleString()} coins\n**Bank Account**: ${bank.toLocaleString()} coins`,
        thumbnail: {url: 'http://www.dank-memer-is-lots-of.fun/coin.png'}
      };
    }
  },
  {
    triggers: ['balance', 'bal', 'inventory', 'coins', 'inv'],
    description: 'Check your coin balance, or someone elses',
    perms: ['embedLinks']
  }
);
