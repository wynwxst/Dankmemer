module.exports = {
  help: 'Announces an update to all subscribed servers.',
  fn: async ({ Memer, args, msg }) => {
    const subscribers = await Memer.db.getDevSubscribers()
    let promises = []
    for (const subscriber of subscribers) {
      promises.push(
        Memer.bot.createMessage(subscriber.channelID, args.join(' '))
          .catch(() => Memer.ipc.fetchGuild(subscriber.id)
            .then(guild => Memer.bot.getDMChannel(guild.ownerID)
              .then(dm => dm.createMessage(`The Update Channel is deleted or i dont have permissions to talk in the update channel you idiot anyway here is the update info\n\n ${args.join(' ')}`)
                .catch(() => Memer.db.deleteDevSubscriber(subscriber.id))
              )
            )
          )
      )
    }
    await Promise.all(promises)
    return 'Succesfully sent update to all subscribers!'
  }
}
