const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let target = Memer.getRateTarget(msg, args);
    const rating = Memer.randomNumber(1, 100);
    return {
      title: 'gay r8 machine',
      description: `${target} ${rating}% gay :gay_pride_flag:`
    };
  },
  {
    triggers: ['howgay', 'gayrate'],
    description: 'See how gay you are'
  }
);
