module.exports = {
  help: 'Wipe expired donors',
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
    msg.channel.createMessage('<a:detective:458370651313405952> Having a look at those pesky people who are way overdue on those payments...');
    await loopThroughPatrons();

    const dateOffset = (24 * 60 * 60 * 1000) * 60;
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
        await Memer.db.removeDonor(discord.user_id);
        promises.push(
          await channel.createMessage({ embed: {
            color: 12000284,
            title: 'Your donor status has been removed',
            description: 'We were unable to process your payment more than once, and sadly we\'ve had to remove your donor perks.\n\n' +
            'If you feel that this was a mistake, please update and validate your payment information and pledge the tier you previously had. You\'ll be back where you were in no time!\n\n' +
            'We appreciate your donations and time, thank you very much!\n' +
            '-- The Dank Memer Team'
          }}).catch(e => e)
        );
      }
    }

    await Promise.all(promises).then(async () => {
      msg.channel.createMessage(`I've successfully messaged ${promises.length} users about expired payments.`);
    });
  }
};
