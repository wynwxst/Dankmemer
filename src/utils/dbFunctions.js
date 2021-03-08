/** @param {import("../models/GenericCommand").Memer} Bot */
module.exports = Bot => ({
  updateModlog: async function updateModlog (guildID, channelID) {
    const res = await this.getGuild(guildID);

    if (channelID === 0) {
      res.modlog = 0;
    }
    res.modlog = channelID;

    return Bot.r.table('guilds')
      .insert(res, { conflict: 'update' });
  },

  fetchModlog: async function fetchModlog (guildID) {
    const res = await this.getGuild(guildID);

    let modlog;
    if (!res.modlog) {
      res.modlog = 0;
      await Bot.r.table('guilds')
        .insert(res, { conflict: 'update' });
    }
    if (res.modlog === 0) {
      modlog = false;
    } else {
      modlog = res.modlog;
    }

    return modlog;
  },

  getGuild: function getGuild (guildID) {
    return Bot.r.table('guilds')
      .get(guildID)
      .default({
        id: guildID,
        prefix: Bot.config.options.prefix,
        modlog: '',
        disabledCategories: [],
        disabledCommands: [],
        enabledCommands: []
      })
      .run();
  },

  updateGuild: function updateGuild (guildEntry) {
    return Bot.r.table('guilds')
      .insert(guildEntry, { conflict: 'update' })
      .run();
  },

  deleteGuild: function deleteGuild (guildID) {
    return Bot.r.table('guilds')
      .get(guildID)
      .delete()
      .run();
  },

  getDevSubscribers: async function getSubscriber () {
    return Bot.r.table('updates')
      .run();
  },

  updateDevSubscriber: function updateDevSubscriber (guildID, channelID) {
    return Bot.r.table('updates')
      .insert({
        id: guildID,
        channelID
      }, { conflict: 'update' })
      .run();
  },

  deleteDevSubscriber: function deleteSubscriber (guildID) {
    return Bot.r.table('updates')
      .get(guildID)
      .delete()
      .run();
  },

  updateCooldowns: async function createCooldown (command, userID, isGlobalPremiumGuild) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()));
    if (!pCommand) {
      return;
    }
    const isDonor = isGlobalPremiumGuild || await this.checkDonor(userID);
    let cooldown;
    if (isDonor) {
      cooldown = pCommand.props.donorCD;
    } else {
      cooldown = pCommand.props.cooldown;
    }
    const profile = await this.getCooldowns(userID, cooldown > 20000 ? 'db' : false);
    if (!profile) {
      return this.createCooldowns(command, userID, isGlobalPremiumGuild);
    }
    if (profile.cooldowns.some(cmd => cmd[command])) {
      profile.cooldowns.forEach(cmd => {
        if (cmd[command]) {
          cmd[command] = Date.now() + cooldown;
        }
      });
    } else {
      profile.cooldowns.push({ [command]: Date.now() + cooldown });
    }
    if (cooldown <= 20000) {
      return Bot.cooldowns.set(userID, { id: userID, cooldowns: profile.cooldowns });
    }
    return Bot.r.table('cooldowns')
      .insert({ id: userID, cooldowns: profile.cooldowns }, { conflict: 'update' });
  },

  createCooldowns: async function createCooldowns (command, userID, isGlobalPremiumGuild) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()));
    if (!pCommand) {
      return;
    }
    const isDonor = isGlobalPremiumGuild || await this.checkDonor(userID);
    const cooldown = isDonor ? pCommand.props.donorCD : pCommand.props.cooldown;
    if (cooldown < 20000) {
      return Bot.cooldowns.set(userID, { id: userID, cooldowns: [ { [command]: Date.now() + cooldown } ] });
    } else {
      return Bot.r.table('cooldowns')
        .insert({ id: userID, cooldowns: [ { [command]: Date.now() + cooldown } ] });
    }
  },

  getCooldowns: function getCooldowns (userID, type) {
    let all = type === 'all';
    if (all || type !== 'db') {
      const cooldown = Bot.cooldowns.get(userID) || {
        cooldowns: [],
        id: userID
      };
      if (!all) {
        return cooldown;
      } else {
        all = cooldown;
      }
    }
    return Bot.r.table('cooldowns')
      .get(userID)
      .run()
      .then(cd => {
        if (all) {
          all.cooldowns = all.cooldowns.concat(cd ? cd.cooldowns : []);
          return all;
        }
        return cd;
      });
  },

  deleteCooldowns: function deleteCooldowns (userID) {
    Bot.cooldowns.delete(userID);
    return Bot.r.table('cooldowns')
      .get(userID)
      .delete()
      .run();
  },

  getSpecificCooldown: async function getSpecificCooldown (command, userID, isDonor, isGlobalPremiumGuild) {
    const cooldown = isDonor || isGlobalPremiumGuild ? (command.donorCD || command.cooldown) : command.cooldown;
    const profile = cooldown < 20000 ? Bot.cooldowns.get(userID) : await Bot.r.table('cooldowns').get(userID).run();
    if (!profile) {
      return 1;
    }
    const cooldowns = profile.cooldowns.find(item => item[command.triggers[0]]);
    if (!cooldowns) {
      return 1;
    }
    return profile.cooldowns.find(item => item[command.triggers[0]])[command.triggers[0]];
  },

  createBlock: function createBlock (id) {
    return Bot.r.table('blocked')
      .insert({ id })
      .run();
  },

  removeBlock: function removeBlock (id) {
    return Bot.r.table('blocked')
      .get(id)
      .delete()
      .run();
  },

  checkBlocked: function checkBlocked (guildID, authorID = 1) {
    return Bot.r.table('blocked').filter(u => u('id').eq(guildID) || u('id').eq(authorID)).count().gt(0).run();
  },

  addPls: async function addPls (guildID, userID) {
    let guild = await this.getPls(guildID);
    if (!guild) {
      return this.initPls(guildID);
    }
    guild.pls++;

    Bot.r.table('guildUsage')
      .insert(guild, { conflict: 'update' })
      .run();

    return Bot.r.table('users')
      .get(userID)
      .update({
        pls: Bot.r.row('pls').add(1)
      })
      .run();
  },

  initPls: function initPls (guildID) {
    return Bot.r.table('guildUsage')
      .insert({
        id: guildID,
        pls: 1
      })
      .run();
  },

  deletePls: function deletePls (guildID) {
    return Bot.r.table('guildUsage')
      .get(guildID)
      .delete()
      .run();
  },

  getPls: async function getPls (guildID) {
    let res = await Bot.r.table('guildUsage')
      .get(guildID)
      .run();
    if (!res) {
      this.initPls(guildID);
      return 0;
    }
    return res;
  },

  topPls: function topPls () {
    return Bot.r.table('guildUsage')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(10)
      .run();
  },

  topUsers: function topUsers () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(15) // TODO: Make 10 along with other (top) functions
      .run();
  },

  getUser: async function getUser (userID) {
    let user = await Bot.r.table('users').get(userID);

    if (!user) {
      user = (await Bot.r.table('users').insert({
        id: userID, // User id/rethink id
        pls: 1, // Total commands ran
        lastCmd: Date.now(), // Last command time
        lastRan: 'nothing', // Last command ran
        spam: 0, // Spam means 2 commands in less than 1s
        pocket: 0, // Coins not in bank account
        bank: 0, // Coins in bank account
        lost: 0, // Total coins lost
        won: 0, // Total coins won
        shared: 0, // Transferred to other players
        streak: {
          time: 0, // Time since last daily command
          streak: 0 // Total current streak
        },
        items: {
          spin: 0, // Fidget Spinners
          memes: 0, // Memes
          tide: 0 // Tide Pods
        },
        upgrades: {
          incr: 0, // Incremental upgrades
          multi: 0, // Multiplier upgrades
          vault: 0, // Bank Vault upgrades
          shares: 0, // Sharing upgrades
          luck: 0 // Luck upgrades
        },
        donor: false, // Donor status, false or $amount
        godMode: false, // No cooldowns, only for select few
        vip: false, // Same cooldowns as donors without paying
        upvoted: false, // DBL voter status
        dblUpvoted: false // discordbotlist.com voter status
      }, {
        returnChanges: true
      }).run()).changes[0].new_val;
    }

    return user;
  },

  removeUser: function removeUser (userID) {
    return Bot.r.table('users')
      .get(userID)
      .delete()
      .run();
  },

  checkVoter: function checkVoter (id) {
    return Bot.r.table('users')
      .get(id)('upvoted')
      .default(false)
      .run();
  },

  addPocket: async function addPocket (id, amount) {
    return Bot.r.table('users')
      .get(id)
      .update({
        pocket: Bot.r.row('pocket').add(Number(amount)),
        won: Bot.r.row('won').add(Number(amount))
      })
      .run();
  },

  addBank: async function addBank (id, amount) {
    return Bot.r.table('users')
      .get(id)
      .update({
        pocket: Bot.r.row('pocket').sub(Number(amount)),
        bank: Bot.r.row('bank').add(Number(amount))
      })
      .run();
  },

  topPocket: function topPocket () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pocket')})
      .limit(10)
      .run();
  },

  removePocket: async function removePocket (id, amount) {
    return Bot.r.table('users')
      .get(id)
      .update({
        pocket: Bot.r.expr([Bot.r.row('pocket').sub(Number(amount)), 0]).max(),
        lost: Bot.r.row('pocket').sub(Number(amount))
      })
      .run();
  },

  removeBank: async function removePocket (id, amount) {
    return Bot.r.table('users')
      .get(id)
      .update({
        bank: Bot.r.row('bank').sub(Number(amount)),
        pocket: Bot.r.row('pocket').add(Number(amount))
      })
      .run();
  },

  addStreak: async function addStreak (id) {
    const streak = await this.getStreak(id);

    streak.time = Date.now();
    streak.streak = ~~streak.streak + 1;

    await Bot.r.table('users').insert({ id, streak }, { conflict: 'update' }).run();
  },

  addSpam: async function addSpam (id) {
    await Bot.r.table('users')
      .get(id)
      .update({
        spam: Bot.r.row('spam').add(1)
      }).run();
  },

  topSpam: function topSpam () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('spam')})
      .limit(10)
      .run();
  },

  addCmd: function addCmd (id) {
    const lastCmd = Date.now();
    return Bot.r.table('users')
      .get(id)
      .update({
        lastCmd
      })
      .run();
  },

  getSpam: function getSpam (id) {
    return Bot.r.table('users')
      .get(id)('spam')
      .default(0)
      .run();
  },

  getStreak: function getStreak (id) {
    return Bot.r.table('users')
      .get(id)('streak')
      .default({})
      .run();
  },

  resetStreak: async function resetStreak (id) {
    const streak = {
      time: Date.now(),
      streak: 1
    };

    await Bot.r.table('users')
      .insert({ id, streak }, { conflict: 'update' })
      .run();
  },

  addDonor: function addDonor (id, donorAmount, donationDate, declineDate, patreonID) {
    return Bot.r.table('donors')
      .insert({
        id,
        donorAmount,
        guilds: [],
        guildRedeems: 0,
        firstDonationDate: donationDate || Bot.r.now(),
        declinedSince: declineDate || null,
        totalPaid: donorAmount,
        patreonID
      }, { conflict: 'update' })
      .run();
  },

  getDonor: function getDonor (id) {
    return Bot.r.table('donors')
      .get(id)
      .default(false)
      .run();
  },

  checkPremiumGuild: async function checkPremiumGuild (id) {
    return !!await Bot.r.table('donors')
      .filter(Bot.r.row('guilds').contains(id))
      .count();
  },

  updateDonorGuild: function updateDonorGuild (id, guilds, guildRedeems) {
    return Bot.r.table('donors')
      .insert({
        id,
        guilds,
        guildRedeems
      }, { conflict: 'update' })
      .run();
  },

  removeDonor: function removeDonor (id) {
    return Bot.r.table('donors')
      .get(id)
      .delete()
      .run();
  },

  findExpiredDonors: async function findExpiredDonors () {
    return Bot.r.table('donors')
      .filter(Bot.r.row('declinedSince').lt(Bot.r.now().sub(30 * 24 * 60 * 60)))
      .run(); // only 1 month after decline date
  },

  wipeExpiredDonors: async function wipeExpiredDonors () {
    return Bot.r.table('donors')
      .filter(Bot.r.row('declinedSince').lt(Bot.r.now().sub(60 * 24 * 60 * 60))) // 2 months after decline date
      .delete({returnChanges: 'always'})
      .run()
      .then(d => d.changes.map(o => o.old_val));
  },

  checkDonor: function checkDonor (id) {
    return Bot.r.table('donors')
      .get(id)('donorAmount')
      .default(false)
      .run();
  },

  checkGlobalPremiumGuild: function checkGlobalPremiumServer (id) {
    return Bot.r.table('donors')
      .filter(Bot.r.row('guilds').contains(id))
      .run()
      .then(results => results[0] && results[0].donorAmount >= 20);
  },

  getStats: function getStats () {
    return Bot.r.table('stats')
      .get(1)('stats')
      .run();
  },

  addTag: async function addTag (id, name, text) {
    return Bot.r.table('tags')
      .insert({guild_id: id, name: name, text: text});
  },

  getAllTags: async function getAllTags (id) {
    let tags = await Bot.r.table('tags')
      .getAll(id, {index: 'guild_id'});
    return tags;
  },

  getTag: async function getTag (id, name) {
    let tags = await Bot.r.table('tags')
      .filter({name: name, guild_id: id})
      .run();
    return tags[0] || false;
  },

  removeTag: async function getTag (id, name) {
    return Bot.r.table('tags')
      .filter({name: name, guild_id: id})
      .delete()
      .run();
  },

  getAutomemeChannel: async function getAutomemeChannel (id) {
    let channel = await Bot.r.table('automeme')
      .get(id)
      .run();
    return channel || false;
  },

  removeAutomemeChannel: async function removeAutomemeChannel (id) {
    return Bot.r.table('automeme')
      .get(id)
      .delete()
      .run();
  },

  allAutomemeChannels: async function allAutomemeChannels () {
    return Bot.r.table('automeme')
      .run();
  },

  addAutomemeChannel: async function addAutomemeChannel (id, channelID, interval, webhookID, webhookToken) { // id = guild ID
    return Bot.r.table('automeme')
      .insert({id: id, channel: channelID, interval, webhookID, webhookToken}, { conflict: 'update' });
  },

  getAutonsfwChannel: async function getAutonsfwChannel (id) {
    let channel = await Bot.r.table('autonsfw')
      .get(id)
      .run();
    return channel || false;
  },

  removeAutonsfwChannel: async function removeAutonsfwChannel (id) {
    return Bot.r.table('autonsfw')
      .get(id)
      .delete()
      .run();
  },

  allAutonsfwChannels: async function allAutonsfwChannels () {
    return Bot.r.table('autonsfw')
      .run();
  },

  addAutonsfwChannel: async function addAutonsfwChannel (id, channelID, interval, type, webhookID, webhookToken) { // id = guild ID
    return Bot.r.table('autonsfw')
      .insert({id, channel: channelID, interval, type, webhookID, webhookToken}, { conflict: 'update' })
      .run();
  }
});
