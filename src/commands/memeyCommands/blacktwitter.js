const { GenericRedditCommand } = require('../../models')

module.exports = new GenericRedditCommand({
  triggers: ['blacktwitter', 'blackpeopletwitter', 'btwitter'],
  description: 'It isnt racist, its just funny',

  endpoint: '/r/BlackPeopleTwitter/top/.json?sort=top&t=week&limit=100',
  type: 'image'
})
