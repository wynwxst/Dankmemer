const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  () => 'OwO',
  {
    triggers: ['owo'],
    description: 'owo whats this',
    perms: []
  }
)
