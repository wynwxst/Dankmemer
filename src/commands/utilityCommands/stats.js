const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    const stats = await Memer.db.getStats();
    return {
      footer: { text: `Version ${Memer.package.version}` },
      fields: [
        {
          name: 'Guild Count',
          value: stats.guilds.toLocaleString(),
          inline: true
        },
        {
          name: 'User Count',
          value: stats.users.toLocaleString(),
          inline: true
        },
        {
          name: 'Voice Channels',
          value: stats.voice,
          inline: true
        },
        {
          name: 'Uptime',
          value: Memer.parseTime(process.uptime()),
          inline: true
        },
        {
          name: 'Shard Latency',
          value: `${msg.channel.guild.shard.latency.toFixed()}ms`,
          inline: true
        },
        {
          name: 'Cluster [shard]',
          value: `${Memer.clusterID} [${msg.channel.guild.shard.id + 1}]`,
          inline: true
        }
      ]
    };
  }, {
    triggers: ['stats'],
    description: 'Returns basic information and statistics about Dank Memer.',
    perms: ['embedLinks']
  }
);
