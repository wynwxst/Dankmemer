const { GenericRedditCommand } = require('../../models/')

module.exports = new GenericRedditCommand({
  triggers: ['copypasta', 'shitpost'],
  description: 'See the top copypastas on reddit!',

  endpoint: '/r/copypasta/top/.json?sort=top&t=week&limit=500',
  type: 'text'
})
