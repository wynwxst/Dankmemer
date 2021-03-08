const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async () => ({
    title: 'Dank Memer Premium',
    description: 'Help fund Dank Memer to keep it alive and performing well, as well as earning some exclusive perks!\n\n[Patreon](https://www.patreon.com/bePatron?c=362724) - Monthly support\n\nRead about [all the possible perks](https://github.com/Dank-Memer/Dank-Memer/wiki/Donor-Rewards) and remember to link your discord account on patreon.',
    footer: { text: 'Hi, my mom says premium is a good thing to purchase' }
  }), {
    triggers: ['premium', 'patreon', 'donate'],
    description: 'See how you can donate to the bot to support the development and get some sweet perks!',
    perms: ['embedLinks']
  }
);
