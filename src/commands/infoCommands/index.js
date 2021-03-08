const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: 'ℹ Info',
  description: 'Here are some basic information commands, guides, and statistics'
}
