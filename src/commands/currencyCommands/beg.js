const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    await addCD()
    const prompt = await msg.channel.createMessage('Hm, let me think...')
    await Memer.sleep(1000)
    await prompt.edit('Hm, let me think... <:feelsthinkman:397488376728780800>')
    await Memer.sleep(2000)
    if (Math.random() >= 0.5) {
      await Memer.db.addPocket(msg.author.id, 1)
      await prompt.edit('Ok sure, have a coin.')
    } else {
      await prompt.edit('Nah, no coin for you.')
    }
  },
  {
    triggers: ['beg'],
    cooldown: 12e4,
    donorCD: 6e4,
    cooldownMessage: 'Stop begging so much, it makes you look like a little baby.\nYou can have more coins in ',
    description: 'haha ur poor so you have to beg for coins lmaoooo'
  }
)
