const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, cleanArgs }) => {
    let args = msg.args.gather();
    await Memer.http.get(`https://dev.anidiots.guide/text/owoify?text=${encodeURIComponent(args)}`, {
      headers: {
        Authorization: Memer.secrets.extServices.idiot
      }
    })
      .then(res => msg.channel.createMessage(res.body.text))
      .catch(() => msg.channel.createMessage('There was an error whilst trying to weebify your text (T_T)'));
  }, {
    triggers: ['weebify', 'owoify'],
    description: 'Make the bot say whatever you want with a bit of weeb',
    usage: '{command} <what you want the bot to say>',

    missingArgs: 'What do you want me to say in weeb speak?'
  }
);
