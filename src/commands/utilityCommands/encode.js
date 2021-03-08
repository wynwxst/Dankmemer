const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let encoded
    let [encode, ...string] = args
    switch (encode) {
      case 'base64':
      case 'b64':
        encoded = Buffer.from(string.join(' ')).toString('base64')
        break
      case 'url':
        encoded = encodeURIComponent(string.join(' '))
        break
      case 'hex':
        let hello = Buffer.from(string.join(' ')).toString('base64')
        let pre = Buffer.from(hello, 'base64')
        encoded = pre.toString('hex')
        break

      default:
        return 'Not a valid type of encoding, please use `base64`, `url`, or `hex`'
    }
    return encoded
  }, {
    triggers: ['encode'],
    usage: '{command}',
    description: 'encode some stuff',
    minArgs: 2,
    missingArgs: 'You need to choose the type of encoding, and text to encode. Please use `base64`, `url`, or `hex`'
  }
)
