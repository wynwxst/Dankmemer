const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const channel = Memer.config.options.featureRequestChannel || '430835458000420864';

    await Memer.bot.createMessage(channel, { embed: {
      title: 'New request:',
      author: { name: `${msg.author.username}#${msg.author.discriminator} | ${msg.author.id}` },
      description: args.join(' '),
      fields: [{ name: 'Sent from:', value: `#${msg.channel.name} in ${msg.channel.guild.name}` }],
      color: Memer.randomColor(),
      footer: { text: `Guild ID: ${msg.channel.guild.id}` },
      timestamp: new Date()
    }});

    await addCD();

    return 'Your feature request has been sent to the developers. Feel free to suggest more after the cooldown.';
  }, {
    triggers: ['featurerequest'],
    description: 'Use this command to request a feature you\'d like the bot to have.',
    missingArgs: 'Use this command to request a feature you\'d like the bot to have. Try again'
  }
);
