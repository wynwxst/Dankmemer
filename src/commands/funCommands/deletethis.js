const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['deletethis'],
  description: 'Lets see some pretty kitties!',

  title: 'Delet this',
  message: 'powered by weeb shit (weeb.sh)',
  JSONKey: 'url',
  reqURL: 'https://api.weeb.sh/images/random?type=delet_this',
  tokenKey: 'weeb'
})
