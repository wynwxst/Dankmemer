const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let channel = msg.channel.guild.channels.filter(c => c.type === 2).find(c => c.name.toLowerCase() === msg.args.gather().toLowerCase() || c.id === msg.args.gather());
    let users = msg.args.resolveUsers();
    users = channel ? channel.voiceMembers.map(m => m) : users.map(user => msg.channel.guild.members.get(user.id)).filter(member => member.voiceState.channelID);
    if (!users.length) {
      return channel ? `There's nobody in **${channel.name}** to kick dingus` : 'oi mate, you\'ve gotta give me a user (or multiple) in a voice channel to kick!';
    }

    await addCD();
    const hahayes = `Voicekick by ${msg.author.username}#${msg.author.discriminator}`;
    msg.channel.guild.createChannel('Voicekick', 2, hahayes, channel ? channel.parentID : null)
      .then(async (newchannel) => {
        await Memer.sleep(100);
        await newchannel.editPosition(channel.position);
        await newchannel.edit({bitrate: channel.bitrate, userLimit: channel.userLimit});
        let promises = [];
        let failed = 0;
        for (let user of users) {
          promises.push(
            user.edit({ channelID: newchannel.id }).catch(() => {
              failed++;
            })
          );
        }

        await Promise.all(promises).then(async () => {
          await newchannel.delete(hahayes);
          if (failed !== promises.length) { // do not post success message if all promises failed
            msg.channel.createMessage(`I successfully kicked ${promises.length} ${promises.length === 1 ? 'person' : 'people'} from their voice channel`);
          }
          if (failed) {
            msg.channel.createMessage(`I failed to remove ${failed} ${failed === 1 ? 'person' : 'people'} from their voice channel. Check that I have the correct permission to move people in voice channels as well as creating new channels and try again.`);
          }
        });
      })
      .catch(() => {
        msg.channel.createMessage(`looks like I dont have perms to recreate this channel, I guess it's private or I'm missing the \`Manage Channels\` permission ¯\\_(ツ)_/¯`);
      });
  },
  {
    triggers: ['voicekick', 'vckick'],
    usage: '{command} [user | channel name or id]',
    description: 'Kicks a specified user from the voice channel they are in, or kicks all members in a voice channel when a channel is specified',
    modPerms: ['manageChannels']
  }
);
