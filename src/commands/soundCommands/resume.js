const { GenericMusicCommand } = require('../../models');

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (music.player.playing) {
    return msg.reply('music is not paused rn smh');
  }
  if (!music.paused) {
    return msg.channel.createMessage('The current song is already playing SMHH');
  }

  await music.pause(false);
  return 'there you go, music resumed';
}, {
  triggers: ['resume'],
  requiresPremium: true,
  description: 'Resume any paused song'
});
