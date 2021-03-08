module.exports = {
  help: 'Announces an update to all subscribed servers.',
  fn: async ({ Memer, args, msg }) => {
    if (!Memer.config.options.owners.includes(msg.author.id)) {
      return 'Woah now, only my "Owners" can do this';
    }
    const m = await msg.channel.createMessage(`confirm new update message? \`y\`/\`n\`\n\n\`(${args.join(' ')})\``);

    const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 5e4);
    if (!choice || choice.content.toLowerCase() !== 'y') {
      return m.edit('whew, dodged a bullet');
    }
    const subscribers = await Memer.db.getDevSubscribers();
    let promises = [];
    for (const subscriber of subscribers) {
      promises.push(
        Memer.bot.createMessage(subscriber.channelID, args.join(' '))
          .catch(() => Memer.ipc.fetchGuild(subscriber.id)
            .then(guild => Memer.bot.getDMChannel(guild.ownerID)
              .then(dm => dm.createMessage(`The Update Channel is deleted or I dont have permissions to talk in the update channel you idiot!!! Anyway here is the update info\n\n ${args.join(' ')}`)
                .catch(() => Memer.db.deleteDevSubscriber(subscriber.id))
              )
            )
          )
      );
    }
    await Promise.all(promises);
    return 'Succesfully sent update to all subscribers!';
  }
};
