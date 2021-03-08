const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['sequel', 'smeme'],
  description: 'The force is NOT with these',

  endpoint: '/r/SequelMemes/top/.json?sort=top&t=week&limit=100',
  type: 'image'
})
