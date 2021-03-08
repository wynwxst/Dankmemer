const GenericCommand = require('../../models/GenericCommand');
module.exports = new GenericCommand(
  async ({Memer, cleanArgs}) => {
    let num = Memer.randomNumber(1, 20);
    return { image:
      { url: `https://www.minecraftskinstealer.com/achievement/a.php?i=${num}&h=Achievement+get%21&t=${encodeURIComponent(cleanArgs.join('+'))}` }
    };
  },
  {
    triggers: ['achievement', 'minecraft', 'mc'],
    description: 'Am I the only one that didnt know minecraft had achievements',
    missingArgs: 'What did you achieve? Try again'
  }
);
