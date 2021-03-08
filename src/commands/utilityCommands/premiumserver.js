
const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    const argument = msg.args.gather();
    const redeemValues = {
      3: 1,
      10: 3,
      20: 5
    };

    await addCD();
    const donor = await Memer.db.getDonor(msg.author.id);
    let guilds = donor.guilds;
    let guildRedeems = donor.guildRedeems;

    if (donor.donorAmount < 3) {
      return 'Only people who have donated $3 or more a month have access to add premium servers.';
    }

    if (argument === 'add') {
      if (await Memer.db.checkPremiumGuild(msg.channel.guild.id) || donor.guilds.includes(msg.channel.guild.id)) {
        return 'This server is already a premium server smh';
      }
      for (let [dollar, value] in redeemValues) {
        if (value > guildRedeems && donor.donorAmount < dollar) {
          return 'You have reached the maximum amount of premium servers for your paid tier!\nTo get more redeemable guilds, visit our Patreon (https://www.patreon.com/dankmemerbot)';
        }
      }

      guilds.push(msg.channel.guild.id);
      await Memer.db.updateDonorGuild(msg.author.id, guilds, guildRedeems++);
      return `Successfully added **${msg.channel.guild.name}** as a premium server!`;
    } else if (argument === 'remove' || argument === 'delete') {
      if (!donor.guilds.includes(msg.channel.guild.id)) {
        return 'This server hasn\'t been added as a premium server';
      }

      await Memer.db.removeAutonsfwChannel(msg.channel.guild.id);
      await Memer.db.removeAutomemeChannel(msg.channel.guild.id);
      guilds.splice(guilds.indexOf(msg.channel.guild.id), 1);
      await Memer.db.updateDonorGuild(msg.author.id, guilds, guildRedeems--);
      return `**${msg.channel.guild.name}** is no longer a premium server.`;
    } else {
      return {
        title: `Premium servers redeemed by ${msg.author.username}`,
        description: await (async () => {
          let index = 0;
          let tosend = [];
          for (let id of guilds) {
            const guild = await Memer.ipc.fetchGuild(id);
            tosend.push(guilds.length ? `\`${index += 1}.\` **${guild.name}** (${id})\n` : 'You have redeemed no premium servers');
          }
          return tosend.join('');
        })()
      };
    }
  },
  {
    triggers: ['premiumserver', 'pserver', 'premium', 'donorserver'],
    usage: '{command} [add | remove]',
    donorCD: 2000,
    donorOnly: true,
    description: 'Add or remove the current guild as a premium server, or leave the arguments blank to list all of your premium servers'
  }
);
