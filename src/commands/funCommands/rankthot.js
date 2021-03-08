const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let target = Memer.getRateTarget(msg, args);
    const rating = Memer.randomNumber(1, 100);
    return {
      title: 'Thotties be thotting',
      description: `${target} **${rating}%** <:THOT:492632571994308608>`
    };
  },
  {
    triggers: ['rankthot', 'thotrate'],
    description: 'See how thot you are'
  }
);
