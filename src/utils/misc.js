const config = require('../config.json')

const errors = {

  // Voice related errors
  'Disconnected': `Discord fucked something up. 😠\n\nTo fix this, you have to got to server settings and change the voice region.\nIf it still doesn't work after that, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`vc1\`.`,

  'Voice connection timeout': `Discord fucked something up. 😠\n\nTo fix this, first try running \`pls stop\`.\nIf that doesn't work, you have to kick me and reinvite me back. I know, it is stupid. 🙄\nIf it still doesn't work after that, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`vc2\`.`,

  'Already encoding': `Something fucked up. 😠\n\nWe're pretty sure this error happens when you're running voice commands too quickly. So slow down 🙄\nIf it's still happening after a while, (<https://discord.gg/ebUqc7F>) and tell support it is error \`vc3\`.`,

  // Currency Errors
  'new_val': `Oopsy doopsy, we made a fucky wucky! 😊\n\nThis shouldn't happen to you again, and we are working semi-hard on fixing it. \nIf it DOES happen again, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`econ1\`.`,

  // Image Errors
  'Invalid character in header content': `Well heck, I didn't like some character you used for this command! 😠\n\nIf you used any "not normal" characters for this command, remove those and try again. \nIf it is still happening, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`img1\`.`,

  'socket hang up': `Looks like we just restarted our image server\n\nOnce it is done rebooting, this command will work again. Give it just a few seconds!\nIf it is still happening after multiple minutes, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`img2\`.`,

  // Discord Errors
  'DiscordRESTError [50001]: Missing Access': `Hey! For some reason I don't have permission to run that command. 😠\n\nMake sure you have given me the correct channel perms to run this command. \nIf it is still happening after messing with permissions, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis1\`.`,

  'Request timed out (>15000ms) on POST': `aggggghhhhhhhh discord is having connection issues 😠\n\nAll we can do is wait until they're better. Sorryyyyyy.\nIf it is still happening after a few hours, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis2\`.`,

  'DiscordRESTError [50013]: Missing Permissions': `Hey! For some reason I don't have permission to run that command. 😠\n\nMake sure you have given me the correct channel perms to run this command. \nIf it is still happening after messing with permissions, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis3\`.`,

  'Must be 2000 or fewer in length': `You included too many characters in that.\n\nI am only able to send 2k characters in one message, so please try again with less characters.\nIf it is still happening, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis4\`.`,

  'DiscordHTTPError: 500 INTERNAL SERVER ERROR on POST': `aggggghhhhhhhh discord is having connection issues 😠\n\nAll we can do is wait until they're better. Sorryyyyyy.\nIf it is still happening after a few hours, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`dis5\`.`,

  // Known Errors
  'Cannot read property \'triggers\' of undefined': `This command is currently under maintance, sorry :(\n\nIt will work if you are spelling the command you are enabling/disabling correctly.\nIf it is still happening, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`bug1\`.`,

  '504 Gateway Timeout': `Look like the service we use for this command is giving us problems :(\n\nAll we can currently do is wait, sadly\nIf it is still happening after a few hours, join (<https://discord.gg/ebUqc7F>) and tell support it is error \`bug2\`.`,

  // Bug Hunting errors
  'DiscordRESTError [10003]: Unknown Channel': `Something broke!\n\nI am currently not sure why this bug is happening, but if you report this bug in the support server, you will get paid for it in meme coins.\nJoin (<https://discord.gg/ebUqc7F>) and tell support it is error \`hunt1\`.`
}

module.exports = {
  errorMessages: async (e) => errors[Object.keys(errors).find((error) => e.message.includes(error))] || false,

  intro: `Sup nerds. My name is **Dank Memer**.\n\nTo get started, send \`${config.defaultPrefix} help\`. All commands are run this way, for example, pls meme.\n\nThere ARE NSFW commands on this bot, but you can disable them with \`pls disable nsfw\`\n`,

  links: '<:technicalsupport:471490462968971264> [Support Server](https://discord.gg/ebUqc7F) - Get help for the bot and meme around\n<:twitter:471490461454827530> [Official Twitter](https://twitter.com/dankmemerbot) - Sometimes win free stuff and meme around\n<:coininhand:471490461467410463> [Patreon Page](https://www.patreon.com/dankmemerbot) - Help support the bot development, and get some sweet perks!\n<:discordlogo:471490461396369409> [Invite Link](https://goo.gl/BPWvB9) - Add the bot to another server and meme around',

  randomColor: () => {
    return Math.floor(Math.random() * 0xFFFFFF)
  },

  calcMultiplier: (Memer, user, userDB, donor, msg) => {
    // calculates total multiplier based on multiple variables
    let guildMember = msg.channel.guild.members.get(msg.author.id)
    let date = new Date(msg.timestamp)
    let day
    let time
    let total
    total = userDB.upgrades.multi
    if (Memer.config.devs.includes(user.id)) {
      total += 5
    }
    if (guildMember.game && guildMember.game.name.toLowerCase().includes('dank memer')) {
      total += 0.5
    }
    if (msg.channel.guild.emojis.length >= 69) {
      if (msg.channel.guild.emojis.length === 69) {
        total += 0.5
      }
      total += 0.5
    }
    if (msg.channel.name.toLowerCase().includes('dank-memer')) {
      total += 0.5
    }
    if (userDB.upvoted) {
      total += 0.5
    }
    if (msg.channel.guild.members.has('419254454169108480')) {
      total += 0.5
    }
    if (donor) {
      total += donor * 0.5
    }
    if (userDB.spam < 25) {
      total += 0.5
    }
    if (userDB.streak.streak >= 15) {
      total += 0.5
    }
    if (user.username.toLowerCase().includes('dank')) {
      total += 0.5
    }
    if (msg.channel.guild.id === '397472167631257600') {
      total += 0.5
    }
    if (date.getMinutes() === 20 && date.getHours() === 4) {
      total += 4.2
      time = true
    }
    if (date.getDay() === 20 && date.getMonth() === 4) {
      total += 4.2
      day = true
    }
    if (time && day) {
      total += 420
    }
    return total
  },

  showMultiplier: (Memer, user, userDB, donor, msg) => {
    // calculates total multiplier based on multiple variables
    let guildMember = msg.channel.guild.members.get(msg.author.id)
    let date = new Date(msg.timestamp)
    let time
    let day
    let count = 14
    let end = {
      locked: 0,
      unlocked: { total: 0, list: [] },
      bought: userDB.upgrades.multi
    }
    if (Memer.config.devs.includes(user.id)) {
      end.unlocked.total += 1
      end.unlocked.list.push('Developer')
    }
    if (guildMember.game && guildMember.game.name.toLowerCase().includes('dank memer')) {
      end.unlocked.total += 1
      end.unlocked.list.push('[Playing dank memer](http://your-stupidity.needs-to-s.top/c3342d.gif)')
    }
    if (msg.channel.guild.emojis.length === 69) {
      end.unlocked.total += 1
      end.unlocked.list.push('69 emotes in the server')
    }
    if (msg.channel.name.toLowerCase() === ('dank-memer')) {
      end.unlocked.total += 1
      end.unlocked.list.push('[Channel is dank-memer](http://your-stupidity.needs-to-s.top/9bf273.png)')
    }
    if (userDB.upvoted) {
      end.unlocked.total += 1
      end.unlocked.list.push('[Voted for the bot](https://discordbots.org/bot/memes/vote)')
    }
    if (msg.channel.guild.members.has('419254454169108480')) {
      end.unlocked.total += 1
      end.unlocked.list.push('Premium server')
    }
    if (donor) {
      end.unlocked.total += 1
      end.unlocked.list.push('[Donor](https://www.patreon.com/dankmemerbot)')
    }
    if (userDB.spam < 25) {
      end.unlocked.total += 1
      end.unlocked.list.push('Doesn\'t spam the bot')
    }
    if (userDB.streak.streak >= 15) {
      end.unlocked.total += 1
      end.unlocked.list.push('15+ daily streak')
    }
    if (user.username.toLowerCase().includes('dank')) {
      end.unlocked.total += 1
      end.unlocked.list.push('Username is dank')
    }
    if (msg.channel.guild.id === '397472167631257600') {
      end.unlocked.total += 1
      end.unlocked.list.push('In support server')
    }
    if (date.getMinutes() === 20 && date.getHours() === 4) {
      end.unlocked.total += 1
      end.unlocked.list.push('4:20')
      time = true
    }
    if (date.getDay() === 20 && date.getMonth() === 4) {
      end.unlocked.total += 1
      end.unlocked.list.push('4/20')
      day = true
    }
    if (time && day) {
      end.unlocked.total += 1
      end.unlocked.list.push('4/20 + 4:20')
    }
    end.locked = count - end.unlocked.total
    return end
  },

  decodeHtmlEntity: (str) => { // Found here: https://gist.github.com/CatTail/4174511
    return str.replace(/&#(\d+);/g, function (match, dec) {
      return String.fromCharCode(dec)
    })
  },

  randomInArray: (array) => {
    return array[Math.floor(Math.random() * array.length)]
  },

  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),

  removeDuplicates: (array) => {
    return Array.from(new Set(array).values())
  },

  codeblock: (str, lang) => {
    return `${'```'}${lang || ''}\n${str}\n${'```'}`
  },

  parseTime: (time) => {
    const methods = [
      { name: 'd', count: 86400 },
      { name: 'h', count: 3600 },
      { name: 'm', count: 60 },
      { name: 's', count: 1 }
    ]

    const timeStr = [ Math.floor(time / methods[0].count).toString() + methods[0].name ]
    for (let i = 0; i < 3; i++) {
      timeStr.push(Math.floor(time % methods[i].count / methods[i + 1].count).toString() + methods[i + 1].name)
    }

    return timeStr.filter(g => !g.startsWith('0')).join(', ')
  },

  punish: async (Memer, id, type, reason, optionalBlock = true, optionalWipe = true) => {
    if (!reason) {
      reason = 'No reason given.'
    }
    if (!type) {
      type = 'user'
    }
    let name
    let object
    if (type === 'user') {
      object = await Memer.ipc.fetchUser(id)
      if (!object) {
        name = 'not sure of the username...'
      } else {
        name = `${object.username}#${object.discriminator}`
      }
    } else {
      object = await Memer.ipc.fetchGuild(id)
      if (!object) {
        name = 'not sure of the server name'
      } else {
        name = object.name
      }
    }
    if (optionalBlock) {
      Memer.db.createBlock(id)
    }
    if (optionalWipe) {
      switch (type) {
        case 'user':
          await Memer.db.removeUser(id)
          break
        case 'guild':
        case 'server':
          await Memer.db.deletePls(id)
          await Memer.db.deleteGuild(id)
          break
      }
    }
    const channel = Memer.config.spamReportChannel || '397477232240754698'
    await Memer.bot.createMessage(channel, `The ${type} **${name}** (*${id}*) was blacklisted.\n**Reason**: ${reason}`)
  },

  paginate: (text, limit = 2000) => {
    const lines = text.split('\n')
    const pages = []

    let chunk = ''

    for (const line of lines) {
      if (chunk.length + line.length > limit && chunk.length > 0) {
        pages.push(chunk)
        chunk = ''
      }

      if (line.length > limit) {
        const lineChunks = line.length / limit

        for (let i = 0; i < lineChunks; i++) {
          const start = i * limit
          const end = start + limit
          pages.push(line.slice(start, end))
        }
      } else {
        chunk += `${line}\n`
      }
    }

    if (chunk.length > 0) {
      pages.push(chunk)
    }

    return pages
  }
}
