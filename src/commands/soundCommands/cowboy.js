const { GenericVoiceCommand } = require('../../models/')

module.exports = new GenericVoiceCommand({
  triggers: ['cowboy', 'screaming'],
  description: 'tbh this is kinda catchy',

  existingConn: 'I can only talk so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '👍',
  dir: 'cowboy',
  ext: 'opus',
  files: 'cowboy'
})
