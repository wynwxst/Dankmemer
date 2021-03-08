const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async () => ({
    fields: [
      { name: 'Add Dank Memer', value: '\n[Here](https://goo.gl/HL3zBi)', inline: true },
      { name: 'Dank Memer Support', value: '\n[Here](https://discord.gg/Wejhbd4)', inline: true },
      { name: 'Dank Memer Twitter', value: '\n[Here](https://twitter.com/dankmemerbot)', inline: true },
      { name: 'Reddit Page', value: '\n[Here](https://www.reddit.com/r/dankmemer/)', inline: true },
      { name: 'Buy some Dank Premium', value: '\n[Here](https://www.patreon.com/bePatron?c=362724)', inline: true },
      { name: 'See some Dank Code', value: '\n[Here](https://github.com/Dank-Memer)', inline: true }

    ]
  }), {
    triggers: ['invite', 'support', 'server', 'links'],
    description: 'Get an invite for the bot or to the support server. Also some extra links to use.',
    perms: ['embedLinks']
  }
);
