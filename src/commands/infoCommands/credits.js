const { GenericCommand } = require('../../models/')

const programmers = [
  ['Melmsie#0001', 'https://github.com/melmsie', 'Initial work and author'],
  ['Aetheryx#2222', 'https://github.com/Aetheryx', 'I like trains'],
  ['CyberRonin#5517', 'https://github.com/TheCyberRonin', 'Melmsie is my lover'],
  ['Kromatic#0420', 'https://github.com/Devoxin', 'Mayonnaise is an instrument'],
  ['perryprog#9657', 'https://github.com/perryprog', 'Stinky contributor']
]

module.exports = new GenericCommand(
  () => ({
    title: 'Dank Memer Developers And Contributors',
    description: programmers.map(info => `[${info[0]}](${info[1]}) — ${info[2]}`).join('\n')
  }), {
    triggers: ['credits', 'helpers', 'devs', 'developers', 'programmers'],
    description: 'Thanks to all of you!',
    perms: ['embedLinks']
  }
)
