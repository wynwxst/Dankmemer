const GenericCommand = require('../../models/GenericCommand');
let min = 500;

const dmStolenUser = async (Memer, user, msg, worth) => {
  if (!user.bot) {
    try {
      const channel = await Memer.bot.getDMChannel(user.id);
      await channel.createMessage(`**${msg.author.username}#${msg.author.discriminator}** has stolen **${worth.toLocaleString()}** coins from you!`);
    } catch (err) {
      await msg.channel.createMessage(`${user.mention}, **${msg.author.username}#${msg.author.discriminator}** just stole **${worth.toLocaleString()}** coins from you!`);
    }
  }
};

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let user = msg.args.resolveUser(true);
    if (!user) {
      return 'try running the command again, but this time actually mention someone to steal from';
    }
    if (msg.author.id === user.id) {
      return 'hey stupid, seems pretty dumb to steal from urself';
    }
    let perp = await Memer.db.getUser(msg.author.id);
    let victim = await Memer.db.getUser(user.id);
    let perpCoins = perp.pocket;
    let victimCoins = victim.pocket;
    let donor = await Memer.db.checkDonor(user.id);
    if (perpCoins < min) {
      return `You need at least ${min} coins to try and rob someone.`;
    }
    if (victimCoins < min) {
      return `The victim doesn't have at least ${min} coins, not worth it man`;
    }
    if (donor < 5) { // $1-$4 gets 5% shields
      victimCoins = victimCoins - (victimCoins * 0.05);
    } else if (donor < 10 && donor > 4) { // $5-$9 gets 25% shields
      victimCoins = victimCoins - (victimCoins * 0.25);
    } else if (donor < 15 && donor > 9) { // $10-$14 gets 60% shields
      victimCoins = victimCoins - (victimCoins * 0.6);
    } else if (donor < 20 && donor > 14) { // $15-$19 gets 80% shields
      victimCoins = victimCoins - (victimCoins * 0.8);
    } else if (donor > 19) { // $20+ gets 95% shields
      victimCoins = victimCoins - (victimCoins * 0.95);
    }
    await addCD();
    let stealingOdds = Memer.randomNumber(1, 100);

    if (stealingOdds <= 60) { // fail section
      let punish;
      if ((perpCoins * 0.05) < 500) {
        punish = 500;
      } else {
        punish = perpCoins * 0.05;
      }
      await Memer.db.removePocket(msg.author.id, Math.round(punish));
      await Memer.db.addPocket(user.id, Math.round(punish));
      return `You were caught! You paid the person you stole from **${Math.round(punish)}** coins.`;
    } else if (stealingOdds > 60 && stealingOdds <= 80) { // 30% payout
      let worth = Math.round(victimCoins * 0.3);
      await Memer.db.addPocket(msg.author.id, worth);
      await Memer.db.removePocket(user.id, worth);
      await dmStolenUser(Memer, user, msg, worth);
      return `You managed to steal a small amount before leaving! 💸\nYour payout was **${worth.toLocaleString()}** coins.`;
    } else if (stealingOdds > 80 && stealingOdds <= 90) { // 50% payout
      let worth = Math.round(victimCoins * 0.5);
      await Memer.db.addPocket(msg.author.id, worth);
      await Memer.db.removePocket(user.id, worth);
      await dmStolenUser(Memer, user, msg, worth);
      return `You managed to steal a large amount before leaving! 💰\nYour payout was **${worth.toLocaleString()}** coins.`;
    } else { // full theft
      let worth = Math.round(victimCoins);
      await Memer.db.addPocket(msg.author.id, worth);
      await Memer.db.removePocket(user.id, worth);
      await dmStolenUser(Memer, user, msg, worth);
      return `You managed to steal a TON before leaving! 🤑\nYour payout was **${worth.toLocaleString()}** coins.`;
    }
  },
  {
    triggers: ['steal', 'rob', 'ripoff'],
    cooldown: 5 * 60 * 1000,
    donorCD: 3 * 60 * 1000,
    perms: ['embedLinks'],
    description: 'Take your chances at stealing from users. Warning, you will lose money if you get caught!',
    cooldownMessage: 'Woahhh there, you need some time to plan your next hit. Wait ',
    missingArgs: 'You need to tag someone to steal from'
  }
);
