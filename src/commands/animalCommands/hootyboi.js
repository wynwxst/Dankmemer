const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['hootyboi', 'hoot', 'superbowl', 'football', 'owl'],
  description: 'hoot',
  footer: 'hoot hoot hoot hoot hoot',
  perms: ['embedLinks'],
  endpoint: '/r/superbowl/hot/.json?sort=top&t=week&limit=100',
  type: 'image'
});
