const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['owl', 'hoot', 'superbowl', 'football'],
  description: 'hoot',
  perms: ['embedLinks'],
  endpoint: '/r/superbowl/hot/.json?sort=top&t=week&limit=100',
  type: 'image'
})
