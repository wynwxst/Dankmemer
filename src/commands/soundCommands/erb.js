const { GenericVoiceCommand } = require('../../models/')

module.exports = new GenericVoiceCommand({
  triggers: ['erb', 'epicrapbattles', 'rap'],
  description: 'Play a random epic rap battle of history',

  reaction: '🎤',
  dir: 'erb',
  ext: 'opus',
  np: true,
  skipIfPlaying: true
})
