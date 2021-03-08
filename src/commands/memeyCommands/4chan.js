const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['4chan'],
  description: 'Yes these 4chan posts come from reddit. Get over it, reddit is better.',

  endpoint: '/r/greentext/top/.json?sort=top&t=day&limit=400',
  type: 'image'
});
