const GenericVoiceCommand = require('../../models/GenericVoiceCommand');

module.exports = new GenericVoiceCommand({
  triggers: ['playclip'],
  description: 'Plays a custom sound clip',
  usage: '{command} <clipname>',
  existingConn: 'Develop the technology to speak two different things simultaneously and then we\'ll talk.',
  ownerOnly: true
});
