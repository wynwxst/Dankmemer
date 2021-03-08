const { GenericVoiceCommand } = require('../../models/')

module.exports = new GenericVoiceCommand({
  triggers: ['hey', 'HEYYEYAAEYAAAEYAEYAA'],
  description: 'HEYYEYAAEYAAAEYAEYAA I SAID HEY',

  existingConn: 'I can only talk so much my dude, wait until I\'m done with whatever sound is playing before trying',
  reaction: '👍',
  dir: 'hey',
  ext: 'opus',
  files: 'hey'
})
