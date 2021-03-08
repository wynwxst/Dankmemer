const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '🔊 Sound',
  description: 'Sounds effects and custom sound clips, what more could you need?'
}
