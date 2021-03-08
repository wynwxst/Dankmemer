const GenericCommand = require('../../models/GenericCommand');
const reaction = [
  '🤢',
  '😰',
  '😵',
  '😥',
  '😕',
  '😗',
  '😏',
  '😌',
  '☺',
  '💁'
];

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let target = !args[0] || args[0].toLowerCase() === 'me'
      ? 'You are'
      : (
        msg.mentions[0]
          ? `${msg.mentions[0].nick || msg.mentions[0].username} is a`
          : `${args.join(' ')} is a`
      );
    const rating = Memer.randomNumber(1, 100);
    const emoji = Math.ceil(rating / reaction.length) - 1;
    return {
      title: 'waifu r8 machine',
      description: `${target} ${rating}/100 waifu ${reaction[emoji]}`
    };
  },
  {
    triggers: ['waifu'],
    description: 'See how good of a waifu you are'
  }
);
