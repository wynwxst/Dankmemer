const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  () => 'yes lol',
  {
    triggers: ['isdankmemeronline', 'isbotonline'],
    description: 'See if the bot is online in your server',
    perms: ['embedLinks']
  }
);
