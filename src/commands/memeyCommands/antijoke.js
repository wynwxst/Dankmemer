const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['antijoke', 'badjoke', 'notajoke'],
  description: 'not even funny',

  endpoint: '/r/AntiJokes/top/.json?sort=top&t=week&limit=100',
  type: 'text'
});
