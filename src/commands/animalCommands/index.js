const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '🐶 Animals',
  description: 'Animals are cool, and you can use these commands to see all your favorites.'
}
