const kill = require('../../assets/arrays/kill.json');
const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const user = msg.args.resolveUser(true, false);

    if (msg.args.args[0] === 'me' || (user && user.id === msg.author.id)) return 'Ok you\'re dead. Please tag someone else to kill.';

    if (!user) return 'do that again, but this time actually mention someone to kill them';

    return Memer.randomInArray(kill)
      .replace(/\$mention/g, user.username)
      .replace(/\$author/g, msg.author.username);
  }, {
    triggers: ['kill', 'murder', 'takecareof'],
    usage: '{command} @user',
    description: 'Sick of someone? Easy! Just kill them!'
  }
);
