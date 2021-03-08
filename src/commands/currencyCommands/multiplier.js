const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD, isGlobalPremiumGuild }) => {
    let user = msg.author;
    let userDB = await Memer.db.getUser(user.id);
    let donor = await Memer.db.checkDonor(user.id);
    let total = await Memer.calcMultiplier(Memer, user, userDB, donor, msg, isGlobalPremiumGuild);
    let show = await Memer.showMultiplier(Memer, user, userDB, donor, msg, isGlobalPremiumGuild);
    await addCD();
    return {
      title: `Here is some info about your Multipliers, ${user.username}`,
      description: `**Current Total Multiplier**: ${total}%\n**Secret Multipliers**: *See below*`,
      fields: [
        { name: `${show.unlocked.total} Unlocked`, value: show.unlocked.list.join('\n') || 'No multipliers', inline: true },
        { name: `${show.locked} Locked`, value: show.locked < 8 ? 'UNKNOWN\n'.repeat(show.locked) : `UNKNOWN x${show.locked}`, inline: true }
      ]
    };
  },
  {
    triggers: ['multiplier', 'multi'],
    description: 'Check your multiplier amount',
    perms: ['embedLinks']
  }
);
