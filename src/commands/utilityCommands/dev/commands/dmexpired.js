module.exports = {
  help: 'DM recently expired donors',
  fn: async ({ Memer, msg }) => {
    let patrons = [];
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
    msg.channel.createMessage('<a:detective:458370651313405952> Having a look at those pesky people who have expired payments...');
    await loopThroughPatrons();

    const dateOffset = (24 * 60 * 60 * 1000) * 30;
    const monthsAgo = new Date(new Date().setTime(new Date().getTime() - dateOffset));
    let promises = [];
    patrons = patrons.filter(p => {
      if (p.payment_data) {
        if (p.payment_data.declined_since) {
          let declinedDate = new Date(p.payment_data.declined_since);
          if (declinedDate <= monthsAgo) {
            return true;
          }
        }
      }
    });
    for (let patron of patrons) {
      let discord = patron.attributes.social_connections.discord;
      if (discord && patron.payment_data) {
        const channel = await Memer.bot.getDMChannel(discord.user_id);

        promises.push(
          await channel.createMessage({ embed: {
            color: 15022389,
            title: 'Your donor status is at risk',
            description: 'There\'s been an issue when trying to process your payment on Patreon, and because we haven\'t been able to receive your payment, you may lose your donor perks!\n\n' +
          '**If you don\'t update your payment information or don\'t have sufficient money on your preferred payment method, your donor status will be removed within a month.**\n' +
          'If you no longer want to pay for donor perks, you can always [remove your pledge at any time](https://patreon.zendesk.com/hc/en-us/articles/360005502572).\n\n' +
          'Thanks for donating, and we hope that you\'ll stay with us!\n' +
          '-- The Dank Memer Team'
          }})
        );
      }
    }

    await Promise.all(promises).then(async () => {
      msg.channel.createMessage(`I've successfully messaged ${promises.length} users about expired payments.`);
    });
  }
};
