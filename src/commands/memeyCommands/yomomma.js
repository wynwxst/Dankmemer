const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer }) => {
    let { raw } = await Memer.http.get('http://api.yomomma.info/')
    const { joke } = JSON.parse(raw)
    return joke
  },
  {
    triggers: ['yomomma', 'momma', 'ym'],
    description: 'Yo momma so fat..'
  }
)
