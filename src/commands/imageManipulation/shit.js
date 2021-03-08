const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['shit', 'shitty'],
  description: 'The shit on my shoe!',
  textLimit: 60,
  textOnly: true,
  requiredArgs: 'Well, what did you step in?'
})
