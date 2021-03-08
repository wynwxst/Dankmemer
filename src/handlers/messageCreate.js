const gifs = require('../assets/arrays/permGifs.json');
const ArgParser = require('../utils/ArgParser.js');
const sleep = require('../utils/misc').sleep;

const AUTORESPONSE_MATRIX = {
  dad: {
    regex: /^(im|i['’]m|i am)\s+(.+)/i,
    parse: (match) => `Hi ${match[2]}, I'm dad`
  },
  sec: {
    regex: /^(one sec$|one second|sec$)/i,
    parse: () => sleep(1000).then(() => 'It\'s been one second')
  },
  ree: {
    regex: /^(ree)/i,
    parse: (match) => `R${'E'.repeat(match.input.split(/ +g/)[0].length)}`
  },
  nou: {
    regex: /^(no (?=u{1,}$))/i,
    parse: () => 'no u'
  }
};
const SWEARWORDS = [
  'fuck', 'penis', 'cunt', 'faggot', 'wank', 'nigger', 'nigga', 'slut', 'bastard', 'bitch', 'asshole', 'dick', 'blowjob', 'cock', 'pussy', 'retard', 'ligma', 'sugondese', 'sugandese', 'fricc', 'hecc', 'sugma', 'updog', 'bofa', 'fugma', 'snifma', 'bepis', 'da wae', 'despacito'
];
const PREMATURE_REQUIREMENTS = [
  'im', 'i\'m', 'i am', 'no u', 'sec', 'one sec', 'ree'
].concat(SWEARWORDS);

exports.handle = async function (msg) {
  this.ddog.increment('global.seen');
  this.ddog.increment(`user.bot.${msg.author.bot}`);
  if (
    !msg.channel.guild ||
    msg.author.bot
  ) {
    return;
  }
  this.ddog.increment(`guild.verification${msg.channel.guild.verificationLevel}`);
  this.ddog.increment(`guild.notifications${msg.channel.guild.defaultNotifications}`);
  this.ddog.increment(`guild.region.${msg.channel.guild.region}`);
  this.ddog.increment(`guild.mfa${msg.channel.guild.mfaLevel}`);
  this.ddog.increment(`guild.verification${msg.channel.guild.verificationLevel}`);
  this.ddog.increment(`guild.large.${msg.channel.guild.large}`);
  this.ddog.increment(`guild.explicit${msg.channel.guild.explicitContentFilter}`);
  this.ddog.increment(`channel.nsfw.${msg.channel.nsfw}`);
  this.ddog.increment(`msg.everyone.${msg.mentionEveryone}`);
  this.ddog.increment(`msg.tts.${msg.tts}`);

  if (this.config.options.dev && !this.config.options.developers.includes(msg.author.id)) { return; }

  this.stats.messages++;
  cacheMessage.call(this, msg);

  let slicedMessage = msg.content.split(/\s+/g);
  let passed;
  if (PREMATURE_REQUIREMENTS.find(a => msg.content.toLowerCase().includes(a))) {
    passed = true;
  } else if (slicedMessage.length > 1) {
    for (const possibleCommand of slicedMessage) {
      if (this.cmds.find(c => c.props.triggers.includes(possibleCommand.toLowerCase())) || this.tags[possibleCommand.toLowerCase()]) {
        passed = true;
      }
    }
  }
  if (!passed || await this.db.checkBlocked(msg.author.id, msg.channel.guild.id)) {
    return;
  }

  const gConfig = await this.db.getGuild(msg.channel.guild.id) || {
    prefix: this.config.options.prefix,
    disabledCommands: [],
    disabledCategories: [],
    enabledCommands: [],
    autoResponse: {
      dad: false,
      ree: false,
      sec: false,
      nou: false
    }
  };

  gConfig.disabledCategories = gConfig.disabledCategories || [];
  gConfig.enabledCommands = gConfig.enabledCommands || [];

  if (!gConfig.autoResponse) {
    gConfig.autoResponse = {
      dad: false,
      ree: false,
      sec: false,
      nou: false
    };
  }

  // Auto responses
  for (const autoResponse in gConfig.autoResponse) {
    if (gConfig.autoResponse[autoResponse]) {
      const entry = AUTORESPONSE_MATRIX[autoResponse];
      const match = entry.regex.exec(msg.content);
      if (match) {
        const result = await entry.parse(match);
        if (result.length <= 2000) {
          this.ddog.increment('autoresponses');
          msg.channel.createMessage(result);
        }
      }
    }
  }

  // Swear detection
  if (gConfig.swearFilter) {
    if (SWEARWORDS.some(word => msg.content.toLowerCase().includes(word))) {
      this.ddog.increment('swearDetected');
      msg.channel.createMessage(`No swearing in this christian server :rage:\n${
        await msg.delete()
          .then(
            () => '',
            () => 'I couldn\'t remove the offending message because I don\'t have `Manage Messages` :('
          )
      }`);
    }
  }

  const selfMember = msg.channel.guild.members.get(this.bot.user.id);
  const mention = `<@${selfMember.nick ? '!' : ''}${selfMember.id}>`;
  const wasMentioned = msg.content.startsWith(mention);
  const triggerLength = (wasMentioned ? mention : gConfig.prefix).length + 1;
  const cleanTriggerLength = (wasMentioned ? `@${selfMember.nick || selfMember.username}` : gConfig.prefix).length + 1;

  if (!msg.content.toLowerCase().startsWith(gConfig.prefix) && !wasMentioned) {
    return;
  }

  let [command, ...args] = msg.content.slice(triggerLength).split(/ +/g);
  const cleanArgs = msg.cleanContent.slice(cleanTriggerLength).split(/ +/g).slice(1); // Preserving this so it doesn't break anything
  // You should use msg.args.cleanContent(consumeRest: boolean), though

  msg.args = new ArgParser(msg, args);

  command = command && (this.cmds.find(c => c.props.triggers.includes(command.toLowerCase())) || this.tags[command.toLowerCase()]);

  let isDonor = await this.db.checkDonor(msg.author.id);
  if (isDonor) { this.ddog.increment(`user.donor`); }
  const isGlobalPremiumGuild = await this.db.checkGlobalPremiumGuild(msg.channel.guild.id);

  if (
    !command &&
    msg.mentions.find(u => u.id === this.bot.user.id) &&
    msg.content.toLowerCase().includes('hello')
  ) {
    return msg.channel.createMessage(`Hello, ${msg.author.username}. My prefix is \`${gConfig.prefix}\`. Example: \`${gConfig.prefix} meme\``);
  } else if (
    !command ||
    (command.props.ownerOnly && !this.config.options.developers.includes(msg.author.id)) ||
    gConfig.disabledCommands.includes(command.props.triggers[0]) ||
    ((gConfig.disabledCategories || []).includes(command.category.split(' ')[1].toLowerCase()) && !['disable', 'enable'].includes(command.props.triggers[0]) && !gConfig.enabledCommands.includes(command.props.triggers[0]))
  ) {
    return;
  } else if (command.props.donorOnly && !isDonor && (!isGlobalPremiumGuild || command.props.triggers.includes('redeem')) && !this.config.options.developers.includes(msg.author.id)) {
    if (command.props.isNSFW) {
      return msg.channel.createMessage('Oi it\'s no nut november, you can fap again next month. Only our donors (`pls donate`) can bypass no nut november rules\n<https://www.youtube.com/watch?v=LNe2ecXj95U>');
    }
    return msg.channel.createMessage('This command is for donors only. You can find more information by using `pls donate` if you are interested.');
  }

  if (msg.member.roles.some(id => msg.channel.guild.roles.get(id).name === 'no memes for you')) {
    this.ddog.increment(`noMemes`);
    return;
  }

  let { spam, lastCmd } = await this.db.getUser(msg.author.id);

  if (spam > 10500) {
    let reason = 'Blacklisted for spamming over 10,500 times. (Cooldowns OR 500ms spam)';
    await this.punish(this, msg.author.id, 'user', reason);
    try {
      const channel = await this.Memer.bot.getDMChannel(msg.author.id);
      await channel.createMessage('You have been blacklisted from the bot for spamming over 10,000 times. Nice.\nYou can appeal at this link and we will check it within 2 weeks\nhttps://goo.gl/forms/fXNIt89AfAbSTA6J3');
    } catch (e) {
      console.log(e);
      this.Memer.bot.createMessage('471802868840792074', `User ${msg.author.username}#${msg.author.discriminator} (${msg.author.id}) did not get the appeal DM`);
    }
    return;
  }

  updateStats.call(this, msg, command, lastCmd);

  this.ddog.increment('total.commands');
  this.ddog.increment(`category.${command.category}`, 1, ['tag:one']);
  this.ddog.increment(`cmd.${command.cmdProps.triggers[0]}`, 1, ['tag:two']);

  const isInCooldown = await checkCooldowns.call(this, msg, command, isDonor, isGlobalPremiumGuild);
  if (isInCooldown) { return; }

  const updateCooldowns = () => this.db.updateCooldowns(command.props.triggers[0], msg.author.id, isGlobalPremiumGuild);

  try {
    const permissions = msg.channel.permissionsOf(this.bot.user.id);
    if (command.props.perms.some(perm => !permissions.has(perm))) {
      checkPerms.call(this, command, permissions, msg);
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
      );
    } else {
      msg.reply = (str) => { msg.channel.createMessage(`${msg.author.mention}, ${str}`); };
      await runCommand.call(this, command, msg, args, cleanArgs, updateCooldowns, isGlobalPremiumGuild, permissions);
    }
  } catch (e) {
    reportError.call(this, e, msg, command, cleanArgs);
  }
};

function cacheMessage (msg) {
  if (!msg.content) { // Ignore attachments without content
    return;
  }
  this.ddog.increment('messagesCached');
  this.redis.set(`msg-${msg.id}`, JSON.stringify({ userID: msg.author.id, content: msg.content, timestamp: msg.timestamp, guildID: msg.channel.guild.id, channelID: msg.channel.id }), 'EX', 20 * 60);
}

async function updateStats (msg, command, lastCmd) {
  if (Date.now() - lastCmd < 500) {
    this.ddog.increment('spam500');
    await this.db.addSpam(msg.author.id);
  }

  await this.db.addCmd(msg.author.id);

  this.db.addPls(msg.channel.guild.id, msg.author.id);
}

async function checkCooldowns (msg, command, isDonor, isGlobalPremiumGuild) {
  const cooldown = await this.db.getSpecificCooldown(command.props, msg.author.id, isDonor, isGlobalPremiumGuild);
  if (cooldown > Date.now() && process.env.NODE_ENV !== 'dev') {
    const waitTime = (cooldown - Date.now()) / 1000;
    let cooldownWarning = command.props.cooldownMessage || `**Time left until you can run the command again:** `;

    const cooldownMessage = {
      embed: {
        color: this.randomColor(),
        title: 'Slow it down, cmon',
        description: cooldownWarning + (waitTime > 60 ? `**${this.parseTime(waitTime)}**` : `**${waitTime.toFixed()} seconds**`) + `\n\n__Default Cooldown__: ${this.parseTime(command.props.cooldown / 1000)}\n__[Donor](https://www.patreon.com/dankmemerbot) Cooldown__: ${!command.props.donorCD ? this.parseTime(command.props.cooldown / 1000) : this.parseTime(command.props.donorCD / 1000)}\n\nWhile you wait, go check our our [Twitter](https://twitter.com/dankmemerbot), [Subreddit](https://www.reddit.com/r/dankmemer/), and [Discord Server](https://www.discord.gg/Wejhbd4)`
      }
    };
    const donorMessage = {
      embed: {
        color: this.randomColor(),
        title: 'Woah now, slow it down',
        description: cooldownWarning + (waitTime > 60 ? `**${this.parseTime(waitTime)}**` : `**${waitTime.toFixed()} seconds**`) + `\n__[Donor](https://www.patreon.com/dankmemerbot) Cooldown__: ${!command.props.donorCD ? this.parseTime(command.props.cooldown / 1000) : this.parseTime(command.props.donorCD / 1000)}`,
        footer: { text: 'Thanks for your support!' }
      }
    };
    await this.db.addSpam(msg.author.id);
    msg.channel.createMessage(isDonor || isGlobalPremiumGuild ? donorMessage : cooldownMessage);
    this.ddog.increment('cooldown');
    return true;
  }
  return false;
}

function checkPerms (command, permissions, msg) {
  const neededPerms = command.props.perms.filter(perm => !permissions.has(perm));
  this.ddog.increment('noPerms');
  if (permissions.has('sendMessages')) {
    if (permissions.has('embedLinks')) {
      msg.channel.createMessage({
        embed: {
          'title': 'oh no!',
          'description': `You need to add **${neededPerms.length > 1 ? neededPerms.join(', ') : neededPerms}** to use this command!\nGo to **Server settings => Roles => Dank Memer** to change this!`,
          'color': this.randomColor(),
          'image': neededPerms.length === 1 ? {
            'url': gifs[neededPerms[0]]
          } : undefined,
          'footer': {
            'text': 'If it still doesn\'t work, check channel permissions too!'
          }
        }
      });
    } else {
      msg.channel.createMessage(
        `You need to add **${neededPerms.join(', ')}** to use this command!\n\nGo to **Server settings => Roles => Dank Memer** to change this!`
      );
    }
  }
}

async function runCommand (command, msg, args, cleanArgs, updateCooldowns, isGlobalPremiumGuild, permissions) {
  this.stats.commands++;
  let res = await command.run({
    msg,
    args,
    cleanArgs,
    Memer: this,
    addCD: updateCooldowns,
    isGlobalPremiumGuild
  });
  if (!res) {
    return;
  }
  if (res instanceof Object) {
    if (res.reply) {
      return msg.channel.createMessage(`${msg.author.mention}, ${res.content}`);
    }
    res = Object.assign({ color: this.randomColor() }, res);

    if (!permissions.has('embedLinks')) {
      res = this.unembedify({
        content: res.content,
        file: res.file,
        embed: res
      });
    } else {
      res = {
        content: res.content,
        file: res.file,
        embed: res
      };
      if (Object.keys(res.embed).join(',') === 'color,content,file') {
        delete res.embed; // plz fix later
      }
    }
  }

  await msg.channel.createMessage(res, res.file);
}

async function reportError (e, msg, command, cleanArgs) {
  this.ddog.increment('function.reportError');
  let date = new Date();
  this.stats.errReported++;
  let message = await this.errorMessages(e);
  let randNum = Math.floor(Math.random() * 99999);
  const channel = this.config.options.errorChannel || '470338254848262154';
  if (!message) {
    msg.channel.createMessage(`Something went wrong lol\nError: \`${command.props.triggers[0]}.${this.clusterID}.${msg.channel.guild.shard.id}.${date.getHours()}:${date.getMinutes()}.err${randNum}\``);
    await this.bot.createMessage(channel, `**Error: ${e.message}**\nCode: \`err${randNum}\`\nCommand Ran: ${command.props.triggers[0]}\nDate: ${date.toLocaleTimeString('en-US')}\nSupplied arguments: ${cleanArgs.join(' ')}\nServer ID: ${msg.channel.guild.id}\nCluster ${this.clusterID} | Shard ${msg.channel.guild.shard.id}\n\`\`\` ${e.stack} \`\`\``);
    this.log(`Command error:\n\tCommand: ${command.props.triggers[0]}\n\tSupplied arguments: ${cleanArgs.join(' ')}\n\tServer ID: ${msg.channel.guild.id}\n\tError: ${e.stack}`, 'error');
  } else {
    msg.channel.createMessage(message);
    await this.bot.createMessage(channel, `**Error: ${e.message}**\nCommand Ran: ${command.props.triggers[0]}\nDate: ${date.toLocaleTimeString('en-US')}\nSupplied arguments: ${cleanArgs.join(' ')}\nServer ID: ${msg.channel.guild.id}\nCluster ${this.clusterID} | Shard ${msg.channel.guild.shard.id}\n\`\`\` ${e.stack} \`\`\``);
    this.log(`Command error:\n\tCommand: ${command.props.triggers[0]}\n\tSupplied arguments: ${cleanArgs.join(' ')}\n\tServer ID: ${msg.channel.guild.id}\n\tError: ${e.stack}`, 'error');
  }
}
