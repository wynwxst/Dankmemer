const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['snek', 'snake'],
  description: 'See some danger noodles, nope ropes, and sneks',
  footer: 'heckin boop',
  endpoint: '/r/snek/top/.json?sort=top&t=week&limit=100',
  type: 'image'
});
