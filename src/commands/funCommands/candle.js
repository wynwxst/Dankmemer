const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ msg }) => {
    if (msg.args.args.join(' ').length > 100) {
      return 'meh, too many letters'
    }
    return {
      image: { url: 'https://emojipedia-us.s3.amazonaws.com/thumbs/120/google/119/candle_1f56f.png' },
      description: `[We lit this candle for](https://youtu.be/2UgPAZtRErI?t=3m8s) **${msg.args.args.join(' ')}**`
    }
  },
  {
    triggers: ['candle'],
    description: 'As seen on youtube, light a candle for someone',
    missingArgs: 'Who am I lighting a candle for?'
  }
)
