const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['surreal', 'surrealmemes'],
  description: 'I really do not understand these',

  endpoint: '/r/surrealmemes/top/.json?sort=top&t=week&limit=100',
  type: 'image'
})
