module.exports = {
  help: 'Show user info',
  fn: async ({ Memer, args }) => {
    if (!args[0] && isNaN(args[0])) {
      return 'you need to give an id';
    }
    let id = args[0];

    let db = await Memer.db.getUser(id);
    let donor = await Memer.db.checkDonor(id);
    let user = await Memer.ipc.fetchUser(id);
    let blacklisted = await Memer.db.checkBlocked(id);
    return {
      title: `${user.username}#${user.discriminator} ${id}`,
      fields: [
        { name: 'Currency', value: `Pocket: ${db.pocket.toLocaleString()}\nBank: ${db.bank.toLocaleString()}\nGained: ${db.won.toLocaleString()}\nShared: ${db.shared.toLocaleString()}\nStreak: ${db.streak.streak.toLocaleString()}`, inline: true },
        { name: 'User', value: `Usage: ${db.pls.toLocaleString()}\nBlacklisted: ${blacklisted}\nLast Ran: ${db.lastRan}\nSpam: ${db.spam.toLocaleString()}\nUpvoted: ${db.upvoted}\nUpvoted on DBL: ${db.dblUpvoted || 'false'}\nDonor: ${!donor ? 'false' : `$${donor}`}`, inline: true }
      ]
    };
  }
};
