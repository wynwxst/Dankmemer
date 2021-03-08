/** @typedef {import('eris').Message} Message
 * @typedef {import('../utils/misc')} Utils
 */

/** @typedef {Object} ExtendedMessage
 * @prop {import("../utils/ArgParser")} args
 */

/** @typedef {Message & ExtendedMessage} MemerMessage */

/** @typedef {Object} Memer
 * @prop {import('rethinkdbdash')} r The RethinkDB interface (haha no intellisense for it because rethonk sucks)
 * @prop {import('redis').RedisClient} redis The redis interface
 * @prop {import('../utils/http')} http The http module
 * @prop {import('../utils/logger')} log The log module
 * @prop {Object} db The database functions
 * @prop {Object} config The Memer config
 * @prop {Object} secrets The secrets, credentials and stuff
 * @prop {import('lavalink').Cluster} lavalink The lavalink cluster
 * @prop {import('../utils/MusicManager')} musicManager The music manager
 * @prop {import('eris').Client} bot The eris client instance
 * @prop {import('../utils/Autopost')} autopost The auto-poster
 * @prop {Array<Object>} cmds An array of all the commands
 * @prop {Utils.randomColor} randomColor
 * @prop {Utils.inviteRemoval} inviteRemoval
 * @prop {Utils.calcMultiplier} calcMultiplier
 * @prop {Utils.showMultiplier} showMultiplier
 * @prop {Utils.decodeHtmlEntity} decodeHtmlEntity
 * @prop {Utils.randomInArray} randomInArray
 * @prop {Utils.randomNumber} randomNumber
 * @prop {Utils.sleep} sleep
 * @prop {Utils.removeDuplicates} removeDuplicates
 * @prop {Utils.codeblock} codeblock
 * @prop {Utils.getHighestRolePos} getHighestRolePos
 * @prop {Utils.parseTime} parseTime
 * @prop {Utils.punish} punish
 * @prop {Utils.paginate} paginate
 * @prop {Utils.format} format
 * @prop {Utils.paginateArray} paginateArray
 */

/** @typedef {Object} CommandProps
 * @prop {String} [usage] How to use the command
 * @prop {Number} [cooldown=2000] The cooldown for this command, defaults to `2000`
 * @prop {Number} [donorCD=500] The donator cooldown for this command, defaults to `500`
 * @prop {Boolean} [isNSFW=false] Whether the command is NSFW, defaults to `false`
 * @prop {Boolean} [ownerOnly=false] Whether the command is restricted to the developers
 * @prop {Array<String>} [perms=[]] An array of permissions memer needs to run this command, defaults to `['sendMessages']`, note that `sendMessages` is always added
 * @prop {Boolean} [donorOnly=false] Whether this command is restricted to donators, defaults to `false`
 * @prop {String} [missingArgs] A error message to send if there is missing arguments
 * @prop {Number} [minArgs] The minimum amount of arguments this command expects
 * @prop {Boolean} [requiresPremium=false] Whether this command is restricted to premium servers, defaults to `false`
 * @prop {Array<String>} triggers An array of strings representing the name and aliases of this command, basically what triggers the command
 * @prop {String} description The description of the command
 */

/** @typedef {Object} FunctionParams
 * @prop {Memer} Memer The Memer instance
 * @prop {MemerMessage} msg The message
 * @prop {Array<String>} args The raw sliced arguments
 * @prop {Array<String>} cleanArgs The raw sliced arguments, but with mentions nullified
 * @prop {Boolean} isGlobalPremiumGuild Whether this guild is a premium guild redeemed by a 20$+ donator
 */

module.exports = class GenericCommand {
  /**
   * Creates a new instance of GenericCommand
   * @param {CommandCallback} fn The function
   * @param {CommandProps} cmdProps - The props
   */
  constructor (fn, props) {
    this.fn = fn;
    this.cmdProps = props;
  }

  async run ({ Memer, msg, args, addCD, cleanArgs, isGlobalPremiumGuild }) {
    if (this.props.missingArgs && !args[0]) {
      return this.props.missingArgs;
    }
    if (this.props.minArgs && args.length < this.props.minArgs) {
      return this.props.missingArgs;
    }
    if (this.props.requiresPremium && !await Memer.db.checkPremiumGuild(msg.channel.guild.id)) {
      return 'This command is only available on **Premium** servers.\nTo learn more about how to redeem a premium server, visit our Patreon https://www.patreon.com/dankmemerbot';
    }
    return this.fn({ Memer, msg, args, addCD, cleanArgs, isGlobalPremiumGuild });
  }

  get props () {
    return Object.assign({
      usage: '{command}',
      cooldown: 2000,
      donorCD: 500,
      isNSFW: false,
      ownerOnly: false,
      donorOnly: false,
      requiresPremium: false
    }, this.cmdProps, {
      perms: ['sendMessages'].concat(this.cmdProps.perms || [])
    });
  }
};

/**
 * @callback CommandCallback
 * @param {FunctionParams} params
 */
