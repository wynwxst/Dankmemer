const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ cleanArgs }) => {
    let args = cleanArgs
    let faces = ['(・`ω´・)', ';w;', 'owo', 'UwU', '>w<', '^w^']
    let v = args.join(' ')
    v = v.replace(/(?:r|l)/g, 'w')
    v = v.replace(/(?:R|L)/g, 'W')
    v = v.replace(/n([aeiou])/g, 'ny$1')
    v = v.replace(/N([aeiou])/g, 'Ny$1')
    v = v.replace(/N([AEIOU])/g, 'Ny$1')
    v = v.replace(/ove/g, 'uv')
    v = v.replace(/!+/g, ' ' + faces[Math.floor(Math.random() * faces.length)] + ' ')
    return v
  }, {
    triggers: ['weebify', 'owoify'],
    description: 'Make the bot say whatever you want with a bit of weeb',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say in weeb speak?'
  }
)
