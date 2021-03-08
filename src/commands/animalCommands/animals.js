const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['animals'],
  description: 'See a multiude of animals from various subreddits',
  footer: 'I just love animals so much..',
  endpoint: '/user/kerdaloo/m/dankanimals/top/.json?sort=top&t=day&limit=100',
  type: 'image'
});
