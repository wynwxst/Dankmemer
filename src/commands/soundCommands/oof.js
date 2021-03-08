const { GenericVoiceCommand } = require('../../models/')

module.exports = new GenericVoiceCommand({
  triggers: ['oof', 'roblox'],
  description: 'For all you roblox fans out there',

  reaction: '💀',
  existingConn: 'I only have voice, dude. Please wait until the current sound is done, you assbutt',
  dir: 'oof',
  ext: 'opus',
  files: 'oof'
})
