const { GenericSoundboardCommand } = require('../../models/')

module.exports = new GenericSoundboardCommand({
  triggers: ['playclip'],
  description: 'Plays a custom sound clip',
  usage: '{command} <clipname>',
  existingConn: 'Develop the technology to speak two different things simultaneously and then we\'ll talk.'
})
