const GenericCommand = require('../../models/GenericCommand');
const amazing = ['amazing', 'incredible', 'stunning', 'unbelievable', 'perfect', 'wonderful'];
const great = ['great', 'admirable', 'marvelous', 'tremendous'];
const good = ['good', 'not bad', 'decent', 'acceptable', 'satisfactory', 'respectable'];
const fine = ['fine', 'ok', 'adequate', 'not bad'];
const bad = ['bad', 'atrocious', 'awful', 'crap', 'crummy', 'lousy', 'poor', 'sad', 'inferior'];

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let args = msg.args.args;
    let target = !args[0] || args[0].toLowerCase() === 'me'
      ? msg.author.username
      : (
        msg.mentions[0]
          ? `${msg.mentions[0].nick || msg.mentions[0].username}`
          : `${args.join(' ')}`
      );
    const rating = Memer.randomNumber(300, 850);
    let response;
    switch (true) {
      case (rating > 800):
        response = Memer.randomInArray(amazing);
        break;
      case (rating > 740):
        response = Memer.randomInArray(great);
        break;
      case (rating > 670):
        response = Memer.randomInArray(good);
        break;
      case (rating > 580):
        response = Memer.randomInArray(fine);
        break;
      default:
        response = Memer.randomInArray(bad);
        break;
    }
    return {
      title: 'OFFICIAL BANK OF DANK MEMER INCORPORATED',
      description: `Dear ${target},\nAfter reviewing, we have found that your credit score is **${rating}**.\nThat credit score is **${response}**!`
    };
  },
  {
    triggers: ['creditscore', 'creditrate'],
    description: 'See what your credit score is (totally believeable)'
  }
);
