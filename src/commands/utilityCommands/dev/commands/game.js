module.exports = {
  help: 'change bot status',
  fn: async ({ Memer, msg, args }) => {
    const m = await msg.channel.createMessage(`confirm new game \`(${args.join(' ')})\`? \`y\`/\`n\``);

    const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 5e4);
    if (!choice || choice.content.toLowerCase() !== 'y') {
      return m.edit('whew, dodged a bullet');
    }
    Memer.bot.editStatus(null, {
      name: args.join(' '),
      type: 0
    });
    return `Status was updated: ${args.join(' ')}`;
  }
};
