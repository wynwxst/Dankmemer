const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    let perms = msg.channel.permissionsOf(msg.author.id);
    if (!perms.has('kickMembers')) {
      return 'lol you do not have kick members perms and you know it';
    }
    if (msg.channel.guild.memberCount < 3) {
      return 'hey this will not work with just the two of us';
    }
    msg.channel.createMessage('This will kick someone at random in your server if it has the permission to do so.\nAre you sure you want to continue? (Yes/No)');
    const prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 30e3);
    if (!prompt) {
      return 'I guess you have more important things to do than answer me.';
    } else if (prompt.content.toLowerCase() === 'no') {
      return 'ok canceling the command then, geez';
    } else if (prompt.content.toLowerCase() !== 'yes') {
      return `${prompt.content} was not an option, it was a yes or no question ffs.`;
    }
    let kicked = await rollUser(Memer, msg);
    await addCD();
    msg.channel.createMessage(`Attempting to kick ${kicked.user.username}#${kicked.user.discriminator}...`);
    const hahayes = `${kicked.user.username}#${kicked.user.discriminator}`;
    await Memer.sleep(1500);
    kicked.kick(`randomly kicked by ${msg.author.username}`)
      .then(() => { return msg.channel.createMessage(`lmfao ${hahayes} was kicked`); })
      .catch(() => {
        msg.channel.createMessage(`looks like I dont have perms to kick ${kicked.user.username}#${kicked.user.discriminator}, try putting my role above everyone else to make this real fun..`);
      });
  },
  {
    triggers: ['randomkick', 'kickroulette'],
    usage: '{command}',
    cooldown: 1e4,
    description: 'Warning, this will kick a random person.',
    perms: ['kickMembers', 'embedLinks'],
    modPerms: ['kickMembers']
  }
);

async function rollUser (Memer, msg) {
  let random = msg.channel.guild.members.random();
  if (random.id === Memer.bot.user.id) {
    return rollUser(Memer, msg);
  }
  if (random.id === msg.channel.guild.ownerID) {
    return rollUser(Memer, msg);
  }
  return random;
}
