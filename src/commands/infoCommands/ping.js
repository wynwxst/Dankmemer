const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({msg}) => ('I swear this used to do something'),
  {
    triggers: ['ping'],
    description: 'test cmd plz ignore'
  }
)
