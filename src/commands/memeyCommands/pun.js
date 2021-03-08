const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  ({ Memer }) => Memer.http.get('https://icanhazdadjoke.com/')
    .set('Accept', 'application/json')
    .then(r => r.body.joke),
  {
    triggers: ['pun', 'dadjoke'],
    description: 'Are they dad jokes, or are they puns? Is there even a difference?'
  }
)
