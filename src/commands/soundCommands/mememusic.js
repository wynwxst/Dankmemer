const { GenericVoiceCommand } = require('../../models/');

module.exports = new GenericVoiceCommand({
  triggers: ['mememusic', 'memesound', 'shitsound'],
  description: 'Meme music? More like bad music',

  dir: 'shitsound',
  ext: 'opus',
  np: true,
  skipIfPlaying: true
});
