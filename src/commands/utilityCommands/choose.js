const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let choices;
    let final;
    if (args.length < 2) {
      return `Well duh, I'm going to pick \`${args[0]}\` if you only give me one choice\nNext time give me more choices, seperated by commas.`;
    }
    let argsJ = args.join(' ');
    if (argsJ.includes(',')) {
      choices = argsJ.split(',');
      final = await Memer.randomInArray(choices);
    } else if (argsJ.includes('|')) {
      choices = argsJ.split('|');
      final = await Memer.randomInArray(choices);
    } else {
      choices = argsJ.split(' ');
      final = await Memer.randomInArray(choices);
    }
    return `${msg.author.username}, I choose \`${final.replace(/`/g, '')}\``;
  }, {
    triggers: ['choose'],
    usage: '{command} item 1, item 2, item 3, etc',
    description: 'Dank Memer will choose something for you',
    missingArgs: 'I choose for you to use this command correctly. Please list some items to choose from.'
  }
);
