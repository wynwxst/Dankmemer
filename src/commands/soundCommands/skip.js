const { GenericMusicCommand } = require('../../models');

module.exports = new GenericMusicCommand(async ({ Memer, music, msg }) => {
  if (!music.voiceChannel || !music.queue[0]) {
    return msg.reply('what are you thinking i\'m not playing any music lmao');
  } else if (msg.member.voiceState.channelID !== music.voiceChannel.id) {
    return msg.reply('you\'re not even in my voice channel, why should i listen to you');
  }
  const userCount = music.voiceChannel.voiceMembers.filter(u => !u.bot).length;
  const requiredVotes = userCount === 2 ? 2 : (userCount % 2 === 0 ? userCount / 2 + 1 : Math.ceil(userCount / 2));
  const isDJ = msg.member.roles && msg.channel.guild.roles ? msg.member.roles.some(id => msg.channel.guild.roles.get(id).name.toLowerCase() === 'dj') : false;
  if (isDJ || music.voiceChannel.voiceMembers.size <= 2) { // check if less than or equal to 2, including current user and bot
    await music.stop();
    if (music.vote) {
      music.resetVote();
    }
  } else {
    if (!music.vote) {
      music.startVote(msg.author.id);
      return `**${msg.author.username}** has voted to skip this song, can we get \`${requiredVotes - music.vote.voted.length}\` more votes`;
    } else {
      if (music.vote.voted.includes(msg.author.id)) {
        return 'you already voted dummy';
      }
      if (music.vote.voted.length + 1 >= requiredVotes) {
        music.resetVote();
        await music.stop();
      } else {
        music.vote.voted.push(msg.author.id);
        return `**${msg.author.username}** has voted to skip this song, can we get \`${requiredVotes - music.vote.voted.length}\` more votes`;
      }
    }
  }
  return 'alright, skipped the current song';
}, {
  triggers: ['skip', 'next'],
  requiresPremium: true,
  description: 'Skips the current song'
});
