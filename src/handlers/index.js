const listeners = require('fs').readdirSync(__dirname)
  .filter(l => l !== 'index.js')
  .map(l => l.split('.')[0]);

module.exports = listeners;
