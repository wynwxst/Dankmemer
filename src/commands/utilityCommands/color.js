const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, args }) => {
    let reqURL;
    let imageURL;
    if (args[0].length === 6 && !args[0].includes(',')) {
      reqURL = `http://www.thecolorapi.com/id?hex=${args[0]}`;
      imageURL = `https://serux.pro/rendercolour?hex=${args[0]}`;
    } else if (!isNaN(Number(args.join('').replace(/,/g, ''))) && args.join(' ').includes(',') && args.join(' ').split(',').length === 3) {
      reqURL = `http://www.thecolorapi.com/id?rgb=${args.join(' ').replace(/\s/g, '')}`;
      imageURL = `https://serux.pro/rendercolour?rgb=${args.join(' ').replace(/\s/g, '')}`;
    } else {
      return 'this is not a valid format!\nYou need to specify a hex (Example: `000000`) or RGB (Example: `100, 100, 100`) color for this command.';
    }
    let req = await Memer.http.get(reqURL);
    return {
      title: req.body.name.value,
      thumbnail: { url: imageURL },
      fields: [
        { name: 'Hex', value: req.body.hex.value, inline: true },
        { name: 'RGB', value: req.body.rgb.value, inline: true }
      ]
    };
  }, {
    triggers: ['color', 'visualize'],
    usage: '{command} <rgb or hex>',
    description: 'Visualize any hex or rgb color',
    missingArgs: 'You need to specify a hex (Example: `000000`) or RGB (Example: `100, 100, 100`) color for this command.'
  }
);
