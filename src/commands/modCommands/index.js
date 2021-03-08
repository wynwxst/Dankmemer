const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`));

module.exports = {
  commands,
  name: '🔨 Moderation',
  description: 'Who needs a mod bot, when dank memer can ban people for you instead?'
};
