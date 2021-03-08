module.exports = {
  help: 'donor <add/rem> <$> <id>',
  fn: async ({ Memer, msg, args }) => {
    const ids = msg.mentions[0] ? msg.mentions.map(u => u.id) : args.slice(2).filter(arg => parseInt(arg));

    if (
      !args[0] ||
      !args[1]
    ) {
      return 'Argument error. The first argument must be one of `add` or `rem`, and the second must be the amount donated';
    }

    if (args[0] === 'add') {
      ids.forEach(id => Memer.db.addDonor(id, parseInt(args[1])));
      const channel = await Memer.bot.getDMChannel(args[2]);
      await channel.createMessage({ embed: {
        color: Memer.randomColor(),
        title: 'You now have donor perks',
        description: `Most donor perks are automatic. But if you want to redeem your coins, use \`pls redeem\`.\n\nIf you would like the premium bot addon, (donated $5 or more on patreon), visit the support server and request it in the correct channel.`
      }});
      return `Successfully added ${ids.join(', ')} to tier ${args[1]}.`;
    } else if (args[0] === 'rem') {
      ids.forEach(id => Memer.db.removeDonor(id));
      return `Successfully removed ${ids.join(', ')}.`;
    }
  }
};
