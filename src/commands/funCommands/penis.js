const GenericCommand = require('../../models/GenericCommand');
module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const { config } = Memer;
    const target = msg.args.gather().toLowerCase() === 'me' ? msg.author : (msg.args.resolveUser(true) || msg.author);
    const name = target.nick || target.username;
    return {
      title: 'peepee size machine',
      description: `${name}'s penis\n8${'='.repeat(Memer.randomNumber(1, 10) * ~~!config.options.developers.includes(target.id))}D`
    };
  },
  {
    triggers: ['penis', 'howbig', 'peepee', 'pickle'],
    description: 'how big peepee'
  }
);
