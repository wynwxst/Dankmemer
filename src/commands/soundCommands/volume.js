const { GenericMusicCommand } = require('../../models');

module.exports = new GenericMusicCommand(async ({ music, args, msg }) => {
  if (!music.player.playing) {
    return msg.reply('what are you thinking i\'m not playing any music lmao');
  }

  const volume = args[0];

  if (Number.isNaN(volume) || volume <= 0 || volume > 150) {
    return 'the volume must be a valid number between **1 and 150**, not that hard smh';
  }

  await music.volume(Number(args));

  return `Volume changed to **${volume}**`;
}, {
  triggers: ['volume'],
  requiresPremium: false,
  description: 'changes the volume of the music'
});
