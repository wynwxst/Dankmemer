const { GenericImageCommand } = require('../../models/')

module.exports = new GenericImageCommand({
  triggers: ['laid', 'getlaid'],
  description: 'feel free to post to me_irl'
})
