const gifs = require('../assets/arrays/permGifs.json')
const ArgParser = require('../utils/ArgParser.js')

exports.handle = async function (msg) {
  this.ddog.increment('global.seen')
  if (
    !msg.channel.guild ||
    msg.author.bot ||
    await this.db.checkBlocked(msg.author.id, msg.channel.guild.id)
  ) {
    return
  }

  const gConfig = await this.db.getGuild(msg.channel.guild.id) || {
    prefix: this.config.defaultPrefix,
    disabledCommands: [],
    disabledCategories: [],
    enabledCommands: []
  }

  let isDonor = await this.db.checkDonor(msg.author.id)

  const selfMember = msg.channel.guild.members.get(this.bot.user.id)
  const mention = `<@${selfMember.nick ? '!' : ''}${selfMember.id}>`
  const wasMentioned = msg.content.startsWith(mention)
  const triggerLength = (wasMentioned ? mention : gConfig.prefix).length + 1
  const cleanTriggerLength = (wasMentioned ? `@${selfMember.nick || selfMember.username}` : gConfig.prefix).length + 1

  if (!msg.content.toLowerCase().startsWith(gConfig.prefix) && !wasMentioned) {
    return
  }

  let [command, ...args] = msg.content.slice(triggerLength).split(/ +/g)
  const cleanArgs = msg.cleanContent.slice(cleanTriggerLength).split(/ +/g).slice(1) // Preserving this so it doesn't break anything
  // You should use msg.args.cleanContent(consumeRest: boolean), though

  msg.args = new ArgParser(msg, args)

  command = command && (this.cmds.find(c => c.props.triggers.includes(command.toLowerCase())) || this.tags[command.toLowerCase()])

  if (
    !command &&
    msg.mentions.find(u => u.id === this.bot.user.id) &&
    msg.content.toLowerCase().includes('hello')
  ) {
    return msg.channel.createMessage(`Hello, ${msg.author.username}. My prefix is \`${gConfig.prefix}\`. Example: \`${gConfig.prefix} meme\``)
  } else if (
    !command ||
    (command.props.ownerOnly && !this.config.devs.includes(msg.author.id)) ||
    gConfig.disabledCommands.includes(command.props.triggers[0]) ||
    (gConfig.disabledCategories.includes(command.category.split(' ')[1].toLowerCase()) && !['disable', 'enable'].includes(command.props.triggers[0]) && !gConfig.enabledCommands.includes(command.props.triggers[0]))
  ) {
    return
  } else if (command.props.donorOnly && !isDonor) {
    return msg.channel.createMessage('This command is for donors only. You can find more information by using `pls donate` if you are interested.')
  }

  let { spam, lastCmd } = await this.db.getUser(msg.author.id)

  if (spam > 1e4) {
    let reason = 'Blacklisted for spamming over 10,000 times.'
    await this.punish(this, msg.author.id, 'user', reason)
    return
  }
  updateStats.bind(this)(msg, command, lastCmd)

  if (msg.member.roles.some(id => msg.channel.guild.roles.get(id).name === 'no memes for you')) {
    this.ddog.increment('role.blocked')
    return
  }

  const isInCooldown = await checkCooldowns.bind(this)(msg, command, isDonor)
  if (isInCooldown) { return }

  const updateCooldowns = () => this.db.updateCooldowns(command.props.triggers[0], msg.author.id)

  try {
    const permissions = msg.channel.permissionsOf(this.bot.user.id)
    if (command.props.perms.some(perm => !permissions.has(perm))) {
      checkPerms(command, permissions, msg)
    } else if (command.props.isNSFW && !msg.channel.nsfw) {
      msg.channel.createMessage(
        {
          'embed': {
            'title': 'NSFW not allowed here',
            'description': 'Use NSFW commands in a NSFW marked channel (look in channel settings, dummy)',
            'color': this.randomColor(),
            'image': {
              'url': gifs.nsfw
            }
          }
        }
      )
    } else {
      msg.reply = (str) => { msg.channel.createMessage(`${msg.author.mention}, ${str}`) }
      await runCommand.bind(this)(command, msg, args, cleanArgs, updateCooldowns)
    }
  } catch (e) {
    reportError.bind(this)(e, msg, command, cleanArgs)
  }
}

async function updateStats (msg, command, lastCmd) {
  if (Date.now() - lastCmd < 1000) {
    await this.db.addSpam(msg.author.id)
  }

  await this.db.addCmd(msg.author.id)

  this.ddog.increment('total.commands')
  this.ddog.increment(`category.${command.category}`, 1, ['tag:one'])
  this.ddog.increment(`cmd.${command.cmdProps.triggers[0]}`, 1, ['tag:two'])

  this.db.addPls(msg.channel.guild.id, msg.author.id)
}

async function checkCooldowns (msg, command, isDonor) {
  const cooldown = await this.db.getSpecificCooldown(command.props.triggers[0], msg.author.id)
  if (cooldown > Date.now() && process.env.NODE_ENV !== 'dev') {
    const waitTime = (cooldown - Date.now()) / 1000
    let cooldownWarning = command.props.cooldownMessage || `**Time left until you can run the command again:** `

    const cooldownMessage = {
      embed: {
        title: 'You are being ratelimited!!!!!!!',
        description: cooldownWarning + (waitTime > 60 ? `${this.parseTime(waitTime)}` : `${waitTime.toFixed()} seconds`) + `\n\nDefault Cooldown: ${this.parseTime(command.props.cooldown / 1000)}\n[Donor](https://www.patreon.com/dankmemerbot) Cooldown: ${command.props.donorBlocked ? this.parseTime(command.props.cooldown / 1000) : this.parseTime(command.props.donorCD / 1000)}`
      }
    }
    const donorMessage = {
      embed: {
        title: 'You are being ratelimited......',
        description: cooldownWarning + (waitTime > 60 ? `${this.parseTime(waitTime)}` : `${waitTime.toFixed()} seconds`) + `\n[Donor](https://www.patreon.com/dankmemerbot) Cooldown: ${command.props.donorBlocked ? this.parseTime(command.props.cooldown / 1000) : this.parseTime(command.props.donorCD / 1000)}`,
        footer: { text: 'Thanks for your support!' }
      }
    }
    this.ddog.increment('cooldown')
    msg.channel.createMessage(isDonor ? donorMessage : cooldownMessage)
    return true
  }
  return false
}

function checkPerms (command, permissions, msg) {
  const neededPerms = command.props.perms.filter(perm => !permissions.has(perm))
  if (permissions.has('sendMessages')) {
    if (permissions.has('embedLinks')) {
      if (neededPerms.length > 1) {
        msg.channel.createMessage({
          embed: {
            'title': 'oh no!',
            'description': `You need to add **${neededPerms.join(', ')}** to use this command!\nGo to **Server settings => Roles => Dank Memer** to change this!`,
            'color': this.randomColor(),
            'footer': {
              'text': 'If it still doesn\'t work, check channel permissions too!'
            }
          }
        })
      } else {
        msg.channel.createMessage(
          {
            'embed': {
              'title': 'oh no!',
              'description': `You need to add **${neededPerms}** to use this command!\nGo to **Server settings => Roles => Dank Memer** to change this!`,
              'color': this.randomColor(),
              'image': {
                'url': gifs[neededPerms[0]]
              },
              'footer': {
                'text': 'If it still doesn\'t work, check channel permissions too!'
              }
            }
          }
        )
      }
    } else {
      msg.channel.createMessage(
        `You need to add **${neededPerms.join(', ')}** to use this command!\n\nGo to **Server settings => Roles => Dank Memer** to change this!`
      )
    }
  }
}

async function runCommand (command, msg, args, cleanArgs, updateCooldowns) {
  let res = await command.run({
    msg,
    args,
    cleanArgs,
    Memer: this,
    addCD: updateCooldowns
  })
  if (!res) {
    return
  }
  if (res instanceof Object) {
    if (res.reply) {
      return msg.channel.createMessage(`${msg.author.mention}, ${res.content}`)
    }
    res = Object.assign({ color: this.randomColor() }, res)
    res = {
      content: res.content,
      file: res.file,
      embed: res
    }
    if (Object.keys(res.embed).join(',') === 'color,content,file') {
      delete res.embed // plz fix later
    }
  }

  await msg.channel.createMessage(res, res.file)
}

async function reportError (e, msg, command, cleanArgs) {
  this.ddog.increment('error')
  let date = new Date(Date.now())
  let message = await this.errorMessages(e)
  const channel = this.config.errorChannel || '431692509895458833'
  if (!message) {
    msg.channel.createMessage(`Something went wrong while executing this hecking command: \`${e.message}\` \nPlease join here (<https://discord.gg/ebUqc7F>) if the issue doesn't stop being an ass and tell staff that it's an \`unknown error\``)
    await this.bot.createMessage(channel, `**Error: ${e.message}**\nCommand Ran: ${command.props.triggers[0]}\nDate: ${date.toUTCString()}\nSupplied arguments: ${cleanArgs.join(' ')}\nServer ID: ${msg.channel.guild.id}\nCluster ${this.clusterID} | Shard ${msg.channel.guild.shard.id}\n\`\`\` ${e.stack} \`\`\``)
    this.log(`Command error:\n\tCommand: ${command.props.triggers[0]}\n\tSupplied arguments: ${cleanArgs.join(' ')}\n\tServer ID: ${msg.channel.guild.id}\n\tError: ${e.stack}`, 'error')
  } else {
    msg.channel.createMessage(message)
    await this.bot.createMessage(channel, `**Error: ${e.message}**\nCommand Ran: ${command.props.triggers[0]}\nDate: ${date.toUTCString()}\nSupplied arguments: ${cleanArgs.join(' ')}\nServer ID: ${msg.channel.guild.id}\nCluster ${this.clusterID} | Shard ${msg.channel.guild.shard.id}\n\`\`\` ${e.stack} \`\`\``)
    this.log(`Command error:\n\tCommand: ${command.props.triggers[0]}\n\tSupplied arguments: ${cleanArgs.join(' ')}\n\tServer ID: ${msg.channel.guild.id}\n\tError: ${e.stack}`, 'error')
  }
}
