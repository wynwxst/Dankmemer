const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['antiantijoke', 'badbadjoke', 'notanotajoke'],
  description: 'not not even funny',

  endpoint: '/r/AntiAntiJokes/top/.json?sort=top&t=week&limit=100',
  type: 'text'
})
