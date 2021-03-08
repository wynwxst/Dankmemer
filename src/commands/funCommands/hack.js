const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const user = msg.args.resolveUser(true, false);
    let hacked;
    if (user) {
      hacked = user;
    } else {
      hacked = msg.args.args.join(' ');
    }

    const prompt = await msg.channel.createMessage(`Hacking ${user ? hacked.username : hacked} now...`);
    await Memer.sleep(1500);
    if (user) {
      await prompt.edit('Finding discord login...');
      await Memer.sleep(1700);
      await prompt.edit(`Found:\n**Email**: \`${hacked.username}***@gmail.com\`\n**Password**: \`*******\``);
      await Memer.sleep(1700);
      await prompt.edit('Fetching dms');
      await Memer.sleep(1000);
      await prompt.edit('Listing most common words...');
      await Memer.sleep(1000);
      await prompt.edit(`Injecting virus into discriminator #${hacked.discriminator}`);
      await Memer.sleep(1000);
      await prompt.edit('Virus injected');
      await Memer.sleep(1000);
    }
    await prompt.edit('Finding IP address');
    await Memer.sleep(2000);
    await prompt.edit('Spamming email...');
    await Memer.sleep(1000);
    await prompt.edit('Selling data to facebook...');
    await Memer.sleep(1000);
    await prompt.edit(`Finished hacking ${user ? hacked.username : hacked}`);
    return 'The hack is complete.';
  },
  {
    triggers: ['hack'],
    cooldown: 5000,
    missingArgs: 'Woaaah slow down, who are we hacking?',
    description: 'Hack your friends! Or your enemies...'
  }
);
