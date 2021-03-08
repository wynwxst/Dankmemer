const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let args = msg.args.args;
    let given;
    let user;
    if (Number(args[0])) {
      given = msg.args.nextArgument();
      user = msg.args.resolveUser(true);
    } else {
      given = args[1];
      user = msg.args.resolveUser();
    }
    if (!user) {
      return 'who r u giving coins to, dumb';
    }
    if (!given || !Number.isInteger(Number(given)) || isNaN(given)) {
      return 'you have to to actually share a number, dummy. Not ur dumb feelings';
    }
    given = Number(given);
    let giverCoins = await Memer.db.getUser(msg.author.id);
    let takerCoins = await Memer.db.getUser(user.id);

    if (given > giverCoins.pocket) {
      return `You only have ${giverCoins.pocket} coins, you can't share that many`;
    }
    if (given < 1) {
      return 'You can\'t share 0 coins you dumb';
    }

    await addCD();
    await Memer.db.addPocket(user.id, given);
    await Memer.db.removePocket(msg.author.id, given);
    return `You gave ${user.username} ${given.toLocaleString()} coins, now you have ${(giverCoins.pocket - given).toLocaleString()} and they've got ${(takerCoins.pocket + given).toLocaleString()}`;
  },
  {
    triggers: ['share', 'give'],
    cooldown: 20 * 60 * 1000,
    donorCD: 60 * 1000,
    description: 'share some coins with someone',
    missingArgs: 'You need to choose who to share with and how many coins dummy'
  }
);
