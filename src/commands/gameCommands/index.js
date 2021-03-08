const commands = require('fs').readdirSync(__dirname)
  .filter(c => c !== 'index.js')
  .map(c => require(`${__dirname}/${c}`));

module.exports = {
  commands,
  name: '🎲 Games',
  description: 'Play some mini-games on your server and with your friends!'
};
