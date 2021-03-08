const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`))

module.exports = {
  commands,
  name: '😏 NSFW',
  description: 'Haha ok yes, this is for 18+ horndogs'
}
