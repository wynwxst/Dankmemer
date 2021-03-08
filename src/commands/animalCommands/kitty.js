const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['kitty', 'pussy', 'cat', 'meow'],
  description: 'Lets see some pretty kitties!',

  title: 'Meow 😻',
  message: 'powered by weeb shit (weeb.sh)',
  JSONKey: 'url',
  reqURL: 'https://api.weeb.sh/images/random?type=animal_cat',
  tokenKey: 'weeb'
})
