const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({msg}) => (`Hi there: \`${msg.channel.guild.shard.latency}ms\``),
  {
    triggers: ['ping'],
    description: 'test cmd plz ignore'
  }
);
