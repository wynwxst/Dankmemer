const { GenericMusicCommand } = require('../../models');

module.exports = new GenericMusicCommand(async ({ music, msg }) => {
  if (!music.player.playing) {
    return msg.reply('what are you thinking i\'m not playing any music lmao');
  }
  if (music.paused) {
    return msg.channel.createMessage('The current song is already paused you FRICKEN BUTT');
  }

  await music.pause();
  return 'okay i paused the music boi';
}, {
  triggers: ['pause'],
  requiresPremium: true,
  description: 'pause the current music'
});
