const { GenericMediaCommand } = require('../../models/')

module.exports = new GenericMediaCommand({
  triggers: ['foxxy', 'fox'],
  description: 'See some foxes!',

  title: 'No clue what the fox says 🦊',
  message: 'Fox is love, fox is life',
  JSONKey: 'image',
  reqURL: 'https://randomfox.ca/floof/'
})
