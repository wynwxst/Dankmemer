module.exports = Bot => ({
  updateModlog: async function updateModlog (guildID, channelID) {
    const res = await this.getGuild(guildID)

    if (channelID === 0) {
      res.modlog = 0
    }
    res.modlog = channelID

    return Bot.r.table('guilds')
      .insert(res, { conflict: 'update' })
  },

  fetchModlog: async function fetchModlog (guildID) {
    const res = await this.getGuild(guildID)

    let modlog
    if (!res.modlog) {
      res.modlog = 0
      await Bot.r.table('guilds')
        .insert(res, { conflict: 'update' })
    }
    if (res.modlog === 0) {
      modlog = false
    } else {
      modlog = res.modlog
    }

    return modlog
  },

  getGuild: function getGuild (guildID) {
    return Bot.r.table('guilds')
      .get(guildID)
      .default({
        id: guildID,
        prefix: Bot.config.defaultPrefix,
        modlog: '',
        disabledCategories: [],
        disabledCommands: [],
        enabledCommands: []
      })
      .run()
  },

  updateGuild: function updateGuild (guildEntry) {
    return Bot.r.table('guilds')
      .insert(guildEntry, { conflict: 'update' })
      .run()
  },

  deleteGuild: function deleteGuild (guildID) {
    return Bot.r.table('guilds')
      .get(guildID)
      .delete()
      .run()
  },

  getDevSubscribers: async function getSubscriber () {
    return Bot.r.table('updates')
      .run()
  },

  updateDevSubscriber: function updateDevSubscriber (guildID, channelID) {
    return Bot.r.table('updates')
      .insert({
        id: guildID,
        channelID
      }, { conflict: 'update' })
      .run()
  },

  deleteDevSubscriber: function deleteSubscriber (guildID) {
    return Bot.r.table('updates')
      .get(guildID)
      .delete()
      .run()
  },

  updateCooldowns: async function createCooldown (command, ownerID) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()))
    if (!pCommand) {
      return
    }
    const isDonor = await this.checkDonor(ownerID)
    let cooldown
    if (isDonor && !pCommand.props.donorBlocked) {
      cooldown = pCommand.props.donorCD
    } else {
      cooldown = pCommand.props.cooldown
    }
    const profile = await this.getCooldowns(ownerID)
    if (!profile) {
      return this.createCooldowns(command, ownerID)
    }
    if (profile.cooldowns.some(cmd => cmd[command])) {
      profile.cooldowns.forEach(cmd => {
        if (cmd[command]) {
          cmd[command] = Date.now() + cooldown
        }
      })
    } else {
      profile.cooldowns.push({ [command]: Date.now() + cooldown })
    }
    return Bot.r.table('cooldowns')
      .insert({ id: ownerID, cooldowns: profile.cooldowns }, { conflict: 'update' })
  },

  createCooldowns: async function createCooldowns (command, ownerID) {
    const pCommand = Bot.cmds.find(c => c.props.triggers.includes(command.toLowerCase()))
    if (!pCommand) {
      return
    }
    const isDonor = await this.checkDonor(ownerID)
    if (isDonor && !pCommand.props.donorBlocked) {
      const cooldown = pCommand.props.donorCD
      return Bot.r.table('cooldowns')
        .insert({ id: ownerID, cooldowns: [ { [command]: Date.now() + cooldown } ] })
    }
    const cooldown = pCommand.props.cooldown
    return Bot.r.table('cooldowns')
      .insert({ id: ownerID, cooldowns: [ { [command]: Date.now() + cooldown } ] })
  },

  getCooldowns: function getCooldowns (ownerID) {
    return Bot.r.table('cooldowns')
      .get(ownerID)
      .run()
  },

  deleteCooldowns: function deleteCooldowns (ownerID) {
    return Bot.r.table('cooldowns')
      .get(ownerID)
      .delete()
      .run()
  },

  getSpecificCooldown: async function getSpecificCooldown (command, ownerID) {
    const profile = await Bot.r.table('cooldowns').get(ownerID).run()
    if (!profile) {
      return 1
    }
    const cooldowns = profile.cooldowns.find(item => item[command])
    if (!cooldowns) {
      return 1
    }
    return profile.cooldowns.find(item => item[command])[command]
  },

  createBlock: function createBlock (id) {
    return Bot.r.table('blocked')
      .insert({ id })
      .run()
  },

  removeBlock: function removeBlock (id) {
    return Bot.r.table('blocked')
      .get(id)
      .delete()
      .run()
  },

  checkBlocked: function checkBlocked (guildID, authorID = 1) {
    return Bot.r.table('blocked').filter(u => u('id').eq(guildID) || u('id').eq(authorID)).count().gt(0).run()
  },

  addPls: async function addPls (guildID, userID) {
    let guild = await this.getPls(guildID)
    let user = await this.getUser(userID)
    if (!guild) {
      return this.initPls(guildID)
    }
    guild.pls++
    user.pls++

    Bot.r.table('guildUsage')
      .insert(guild, { conflict: 'update' })
      .run()

    return Bot.r.table('users')
      .insert(user, {conflict: 'update'})
      .run()
  },

  initPls: function initPls (guildID) {
    return Bot.r.table('guildUsage')
      .insert({
        id: guildID,
        pls: 1
      })
      .run()
  },

  deletePls: function deletePls (guildID) {
    return Bot.r.table('guildUsage')
      .get(guildID)
      .delete()
      .run()
  },

  getPls: async function getPls (guildID) {
    let res = await Bot.r.table('guildUsage')
      .get(guildID)
      .run()
    if (!res) {
      this.initPls(guildID)
      return 0
    }
    return res
  },

  topPls: function topPls () {
    return Bot.r.table('guildUsage')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(10)
      .run()
  },

  topUsers: function topUsers () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pls')})
      .limit(15) // TODO: Make 10 along with other (top) functions
      .run()
  },

  getUser: async function getUser (userID) {
    let user = await Bot.r.table('users').get(userID)

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
        upvoted: false // DBL voter status
      }, {
        returnChanges: true
      }).run()).changes[0].new_val
    }

    return user
  },

  removeUser: function removeUser (userID) {
    return Bot.r.table('users')
      .get(userID)
      .delete()
      .run()
  },

  checkVoter: function checkVoter (id) {
    return Bot.r.table('users')
      .get(id)('upvoted')
      .default(false)
      .run()
  },

  addPocket: async function addPocket (id, amount) {
    let res = await this.getUser(id)
    res.pocket += amount
    res.won += amount

    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  addBank: async function addBank (id, amount) {
    let res = await this.getUser(id)
    res.bank += amount

    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  topPocket: function topPocket () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('pocket')})
      .limit(10)
      .run()
  },

  roundPocket: async function roundPocket (id) {
    let res = await this.getUser(id)
    res.pocket = Math.round(res.pocket)

    Bot.r.table('users')
      .insert(res, { conflict: 'update' })
    return res
  },

  removePocket: async function removePocket (id, amount) {
    let res = await this.getUser(id)

    res.pocket = Math.max(0, res.pocket - amount)
    res.lost -= amount
    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  removeBank: async function removePocket (id, amount) {
    let res = await this.getUser(id)

    res.bank = Math.max(0, res.bank - amount)
    return Bot.r.table('users')
      .insert(res, { conflict: 'update' })
  },

  addStreak: async function addStreak (id) {
    const streak = await this.getStreak(id)

    streak.time = Date.now()
    streak.streak = ~~streak.streak + 1

    await Bot.r.table('users').insert({ id, streak }, { conflict: 'update' }).run()
  },

  addSpam: async function addSpam (id) {
    const spam = (await this.getSpam(id)) + 1
    await Bot.r.table('users').insert({ id, spam }, { conflict: 'update' }).run()
  },

  topSpam: function topSpam () {
    return Bot.r.table('users')
      .orderBy({index: Bot.r.desc('spam')})
      .limit(10)
      .run()
  },

  addCmd: function addCmd (id) {
    const lastCmd = Date.now()
    return Bot.r.table('users')
      .insert({ id, lastCmd }, { conflict: 'update' })
      .run()
  },

  getSpam: function getSpam (id) {
    return Bot.r.table('users')
      .get(id)('spam')
      .default(0)
      .run()
  },

  getStreak: function getStreak (id) {
    return Bot.r.table('users')
      .get(id)('streak')
      .default({})
      .run()
  },

  resetStreak: async function resetStreak (id) {
    const streak = {
      time: Date.now(),
      streak: 1
    }

    await Bot.r.table('users')
      .insert({ id, streak }, { conflict: 'update' })
      .run()
  },

  addDonor: function addDonor (id, donorAmount) {
    return Bot.r.table('donors')
      .insert({ id, donorAmount }, { conflict: 'update' })
      .run()
  },

  removeDonor: function removeDonor (id) {
    return Bot.r.table('donors')
      .get(id)
      .delete()
      .run()
  },

  checkDonor: function checkDonor (id) {
    return Bot.r.table('donors')
      .get(id)('donorAmount')
      .default(false)
      .run()
  },

  getStats: function getStats () {
    return Bot.r.table('stats')
      .get(1)('stats')
      .run()
  }
})
