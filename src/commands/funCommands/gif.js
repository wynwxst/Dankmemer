const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let search = encodeURIComponent(msg.args.args.join(' '));
    const data = await Memer.http.get('https://api.giphy.com/v1/gifs/search')
      .query({ api_key: Memer.secrets.extServices.giphy, q: search, limit: 25, rating: 'PG-13', lang: 'en' });

    if (!data.body.data[0]) return 'rip, I can\'t find any images for that. try something else.';

    return {
      title: `First Result for "${decodeURIComponent(search)}" on GIPHY`,
      // description: 'Powered by [GIPHY](https://giphy.com/)',
      thumbnail: { url: 'https://image.ibb.co/b0Gkwo/Poweredby_640px_Black_Vert_Text.png' },
      image: { url: data.body.data[0].images.original.url }
    };
  }, {
    triggers: ['gif', 'giphy'],
    usage: '{command} search terms',
    description: 'Get some sicc gifs to show how you feel',
    missingArgs: 'what gif lol'
  }
);
