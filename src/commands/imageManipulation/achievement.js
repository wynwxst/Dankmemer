const { GenericCommand } = require('../../models/')
module.exports = new GenericCommand(
  async ({msg, cleanArgs}) => {
    let num = Math.floor(Math.random() * 20) + 1
    return { image:
      { url: `https://www.minecraftskinstealer.com/achievement/a.php?i=${num}&h=Achievement+get%21&t=${encodeURIComponent(cleanArgs.join('+'))}` }
    }
  },
  {
    triggers: ['achievement', 'minecraft', 'mc'],
    description: 'Am I the only one that didnt know minecraft had achievements',
    missingArgs: 'What did you achieve? Try again'
  }
)
