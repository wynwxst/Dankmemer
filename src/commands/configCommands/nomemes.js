const { GenericCommand } = require('../../models')

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    return '**__How to prevent someone from using the bot__**\nIf you for some reason have someone you do not want using Dank Memer, you can try the following:\n**1)** Create a new role in your server\n**2)** Name the role EXACTLY this: no memes for you\n**3)** Give the role to the person who should not be using Dank Memer.\n\nIf you spell the role correctly including correct caps, Dank Memer should ignore anyone with that role!'
  }, {
    triggers: ['nomemes'],
    usage: '{command}',
    description: 'See how to block people from using the bot',
    perms: ['embedLinks']
  }
)
