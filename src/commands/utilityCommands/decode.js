const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let decoded;
    let [decode, ...string] = args;
    switch (decode) {
      case 'base64':
      case 'b64':
        decoded = Buffer.from(string.join(' '), 'base64').toString();
        break;
      case 'url':
        decoded = decodeURIComponent(string.join(' '));
        break;
      case 'hex':
        decoded = Buffer.from(string.join(' '), 'hex').toString('utf8');
        break;

      default:
        return 'Not a valid type of decoding, please use `base64`, `url`, or `hex`';
    }
    return Memer.inviteRemoval(decoded);
  }, {
    triggers: ['decode'],
    usage: '{command}',
    description: 'decode some stuff',
    minArgs: 2,
    missingArgs: 'You need to choose the type of decoding, and string to decode. Please use `base64`, `url`, or `hex`'
  }
);
