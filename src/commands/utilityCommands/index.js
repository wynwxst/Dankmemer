const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '🛠 Utility',
  description: 'These commands are useful, since when am I a useful bot? 🤔'
}
