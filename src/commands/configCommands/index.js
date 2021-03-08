const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '⚙ Config',
  description: 'Configure the bot to your liking, all settings are per server.'
}
