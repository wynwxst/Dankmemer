const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let patrons = [];
    const user = Memer.config.options.developers.includes(msg.author.id) ? (msg.args.resolveUser() || msg.author) : msg.author;

    const loopThroughPatrons = async (url) => {
      let res = await Memer.http.get(url || `https://www.patreon.com/api/oauth2/api/campaigns/${Memer.config.options.patreonCampaignID}/pledges?include=patron.null&page%5Bcount%5D=100`, {headers: {'Authorization': `Bearer ${Memer.secrets.extServices.patreon}`}});
      if (!res.body) {
        return;
      }
      res = JSON.parse(res.body);
      for (const patron of res.included) {
        if (patron.type === 'user' && res.data.find(p => p.relationships.patron.data.id === patron.id)) {
          const pledge = res.data.find(p => p.relationships.patron.data.id === patron.id);
          patrons.push({ attributes: patron.attributes, payment_data: pledge ? pledge.attributes : null, id: patron.id });
        }
      }
      if (res.links.next) {
        await loopThroughPatrons(res.links.next);
      } else {
        return patrons;
      }
    };
    msg.channel.createMessage('<a:detective:458370651313405952> Looking for your donor perks, this might take a moment...');
    await loopThroughPatrons();

    if (!patrons) {
      return 'There wass an error whilst trying to obtain patron data. Please try again later.';
    }
    await addCD();

    for (let patron of patrons) {
      let discord = patron.attributes.social_connections.discord;
      if (discord && patron.payment_data && (discord.user_id === user.id)) {
        await Memer.db.addDonor(user.id, patron.payment_data.amount_cents / 100, new Date(patron.payment_data.created_at), new Date(patron.payment_data.declined_since), patron.id);
        const channel = await Memer.bot.getDMChannel(user.id);
        const perkchannel = Memer.config.options.donorPerksChannel || '471802900054671370';

        await Memer.bot.createMessage(perkchannel, { embed: {
          author: {
            name: `${user.username}#${user.discriminator}`,
            icon_url: user.dynamicAvatarURL()
          },
          description: `Successfully linked to Patreon under **${patron.attributes.full_name}** (\`$${patron.payment_data.amount_cents / 100}\`)`,
          footer: { text: `User ID: ${user.id}` }
        }});
        channel.createMessage({ embed: {
          color: 6732650,
          title: 'You now have donor perks',
          description: `Thanks for your donation!\nMost donor perks are automatic. If you want to redeem your coins, use \`pls redeem\`.\n`,
          fields: patron.payment_data.amount_cents > 300 ? [
            {
              name: 'You have access to Premium Memer!',
              value: 'Since you have donated above $3, you have the option to set a server as premium for extra commands, including command tags, autoposting memes, music, and much more!\nTo do this, run `pls pserver add` in the server you want to activate premium perks for!'
            }
          ] : null,
          footer: { text: 'ur a cool person' }
        }});
        return 'You\'ve successfully linked your Discord account with Patreon. Enjoy your perks!\nFor more assistance, you can visit our support server (https://discord.gg/Wejhbd4)';
      }
    }
    return 'We weren\'t able to link your Discord account with your Patreon account.\nPlease ensure that you have donated and the payment was successful, and that Patreon has access to your Discord account. If you need help linking your Discord account to Patreon, try looking at this article\n<https://patreon.zendesk.com/hc/en-us/articles/212052266-How-do-I-receive-my-Discord-role->';
  }, {
    triggers: ['link'],
    usage: '{command}',
    cooldown: 15e3,
    donorCD: 15e3,
    description: 'Link your Discord account with Patreon'
  }
);
