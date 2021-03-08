const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '💰 Currency',
  description: 'Gambling, banks, and stealing stuff. What more could you want?'
}
