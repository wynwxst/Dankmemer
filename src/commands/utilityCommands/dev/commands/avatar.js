module.exports = {
  help: 'change bot avatar',
  fn: async ({ Memer, msg, args }) => {
    if (!Memer.config.options.owners.includes(msg.author.id)) {
      return 'Woah now, only my "Owners" can do this';
    }
    const m = await msg.channel.createMessage(`confirm new avatar? \`y\`/\`n\`\n\n${args.join(' ')}`);

    const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 5e4);
    if (!choice || choice.content.toLowerCase() !== 'y') {
      return m.edit('whew, dodged a bullet');
    }
    await setAvatar(Memer, args.join(' '));
    return `avatar was updated: ${args.join(' ')}`;
  }
};

async function setAvatar (Memer, url) {
  const { body, headers } = await Memer.http.get(url);
  Memer.bot.editSelf({ avatar: `data:${headers['content-type']};base64,${body.toString('base64')}` });
}
