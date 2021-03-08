const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '😂 Memey',
  description: 'This is a meme bot, here are your memes. Memes reign supreme.'
}
