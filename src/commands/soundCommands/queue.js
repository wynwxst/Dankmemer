const { GenericMusicCommand } = require('../../models');

module.exports = new GenericMusicCommand(async ({ Memer, music, msg }) => {
  const page = Number(msg.args.gather()) || 1;
  const pageLength = 10;
  let embed = '';
  let data = music.queue.slice(1);

  if (data.length < 1) {
    return 'There are no songs in the queue. Add more or get out';
  }
  if (isNaN(page) || page < 1) return 'that\'s not a valid page you assbutt';
  if (Math.ceil(data.length / pageLength) < page) return `are you insane there's only ${Math.ceil(data.length / pageLength)} pages`;
  if (data.length > pageLength) {
    embed = `Page ${page} of ${Math.ceil(data.length / pageLength)}`;
    data = data.slice(pageLength * (page - 1), (pageLength * (page - 1)) + pageLength);
  }

  msg.channel.createMessage({
    embed: {
      title: 'Queue',
      color: Memer.randomColor(),
      description: data.map((song, index) => `\`${index + (music.queue.length > pageLength ? pageLength * (page - 1) : 0) + 1}.\` ${song.info.title}`).join('\n'),
      footer: {
        text: embed
      }
    }
  });
}, {
  triggers: ['queue', 'songs'],
  usage: '{command} [page]',
  requiresPremium: true,
  description: 'Lists all of the songs currently in the queue'
});
