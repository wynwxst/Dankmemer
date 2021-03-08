const { GenericRedditCommand } = require('../../models');

module.exports = new GenericRedditCommand({
  triggers: ['foodporn'],
  description: 'See some food that makes your mouth water',
  footer: 'I get so hungry looking at this...',
  endpoint: '/r/FoodPorn/top/.json?sort=top&t=day&limit=75',
  type: 'image'
});
