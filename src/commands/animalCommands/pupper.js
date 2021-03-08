const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['pupper', 'doggo', 'dog', 'yipper', 'puppy', 'borkyboi'],
  description: 'See some cute doggos!',

  title: 'Bork Bork! 🐶',
  message: 'powered by weeb shit (weeb.sh)',
  JSONKey: 'url',
  reqURL: 'https://api.weeb.sh/images/random?type=animal_dog',
  tokenKey: 'weeb'
})
