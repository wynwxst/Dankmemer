const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const prompt = await msg.channel.createMessage('⚠ **WARNING, ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!**')
    await Memer.sleep(1500)
    await prompt.edit('⚠ **WARNING, ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!**\nProceed with format (Y/N)?')
    await Memer.sleep(3500)
    await prompt.edit('⚠ **WARNING, ALL DATA ON NON-REMOVABLE DISK DRIVE C: WILL BE LOST!**\nProceed with format (Y/N)?\nY')
    await Memer.sleep(1000)
    const prompt2 = await msg.channel.createMessage('**Formatting...** 0 %')
    await Memer.sleep(1000)
    await prompt2.edit('**Formatting...** 25 %')
    await Memer.sleep(1000)
    await prompt2.edit('**Formatting...** 55 %')
    await Memer.sleep(1000)
    await prompt2.edit('**Formatting...** 85 %')
    await Memer.sleep(1000)
    await prompt2.edit('**Formatting...** 95 %')
    await Memer.sleep(1500)
    await prompt2.edit('**Formatting...** 95 %\n*JUST KIDDING!*')
  },
  {
    triggers: ['format'],
    cooldown: 5000,
    description: 'As seen on youtube, now you can format your drive!'
  }
)
