const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args, addCD }) => {
    const cancerSearcher = /^[^\w\s\d]/;
    let nickname = msg.args.args.join(' ') || 'cancer name';
    if (nickname.length > 32 || nickname.length < 1) {
      return `The nickname you provided was too long or too short (${nickname.length} characters)`;
    }
    if (cancerSearcher.exec(nickname)) {
      return 'well that\'s a bit pointless, renaming all the cancerous names to ANOTHER cancerous name?!';
    }
    await addCD();
    let members = msg.channel.guild.members.filter(u => {
      return cancerSearcher.exec(u.nick || u.username);
    });
    const promises = [];
    let failed = 0;
    for (const member of members) {
      promises.push(
        member.edit({ nick: nickname }).catch(() => {
          failed++;
        })
      );
    }

    if (!promises[0]) {
      return `There's nobody with a cancerous name, what a great day!`;
    }

    let next = Number(800 * members.length);
    if (next < 1) {
      next = 1;
    }
    const hours = Math.floor(next / 3600000);
    const minutes = Math.floor((next / 60000) - (hours * 60));
    const seconds = Math.floor((next / 1000) - ((hours * 3600) + (minutes * 60)));
    const timeArr = [ { type: {singular: 'hour', plural: 'hours'}, amount: hours }, { type: {singular: 'minute', plural: 'minutes'}, amount: minutes }, { type: {singular: 'second', plural: 'seconds'}, amount: seconds } ];
    let properArr = [];
    for (let i in timeArr) {
      if (timeArr[i].amount < 1) continue;
      properArr.push(`${timeArr[i].amount} ${timeArr[i].amount === 1 ? timeArr[i].type.singular : timeArr[i].type.plural}`);
    }
    const timeLeft = properArr.slice(0, -2).join(', ') + (properArr.slice(0, -2).length ? ', ' : '') + properArr.slice(-2).join(' and ');

    msg.channel.createMessage(`Now renaming **${members.length} ${members.length === 1 ? 'person' : 'people'}** with cancerous names, this may take a while depending on the size of your server\n**ETA**: ${timeLeft}`);
    await Promise.all(promises);
    let finalRenamed = members.length - failed;
    let modlog = await Memer.db.fetchModlog(msg.channel.guild.id);
    if (modlog) {
      Memer.bot.createMessage(modlog, `**${msg.author.username}#${msg.author.discriminator}** decancered ${finalRenamed} poor ${finalRenamed === 1 ? 'user' : 'users'}.`);
    }
    msg.channel.createMessage(`Finished renaming ${finalRenamed} ${finalRenamed === 1 ? 'person' : 'people'} with cancerous names`);
    if (failed) {
      return `I failed to rename ${failed} people, check that they don't have a higher role than me and try again`;
    }
  },
  {
    triggers: ['decancer', 'uncancer', 'dehoist'],
    usage: '{command} [nickname] [role]',
    cooldown: 30 * 60 * 1000,
    description: 'Warning, this will rename any people with crappy/annoying special characters in their name if the bot has the correct permissions',
    modPerms: ['manageNicknames']
  }
);
