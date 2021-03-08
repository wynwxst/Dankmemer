const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['memeeconomy', 'memeecon'],
  description: 'See what memes are being invested in the most today',

  endpoint: '/r/memeeconomy/top/.json?sort=top&t=week&limit=100',
  type: 'image'
});
