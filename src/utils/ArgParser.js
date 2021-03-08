/** @typedef {import('eris').User} User
 * @typedef {import('eris').VoiceChannel} VoiceChannel
 * @typedef {import('eris').TextChannel} TextChannel
 * @typedef {import('eris').Role} Role
 * @typedef {import('eris').Message} Message
 * @typedef {import('eris').Client} Client
*/

const idMatcher = /^([0-9]{15,21})$/;
const userMentionMatcher = /<@!?([0-9]{15,21})>/;
const channelMentionMatcher = /<#([0-9]{15,21})>/;
const roleMentionMatcher = /<@&([0-9]{15,21})>/;

class ArgParser {
  constructor (msg, args) {
    /** @type {Message} The message */
    this.msg = msg;
    /** @type {Array<String>} The raw sliced arguments */
    this.args = args;
    /** @type {Client} The eris client instance */
    this.bot = msg._client;
  }

  /**
   * Resolves a user using the next argument in the list or all remaining arguments
   * @param {Boolean} consumeRest Whether to use the rest of the arguments to resolve the user or not
   * @param {Boolean} consumeOnFail Whether to consume the arguments or preserve them if the args weren't resolved
   * @return {Null|User} Null if the argument couldn't be resolved, otherwise the user object
   */
  resolveUser (consumeRest = false, consumeOnFail = true) {
    // TODO: Quotation support
    const args = consumeRest
      ? this.args.splice(0).join(' ')
      : this.args.shift(); // We use splice to ensure the args array is emptied

    if (!args) {
      return null; // We have nothing to resolve a user with
    }

    const idMatch = idMatcher.exec(args) || userMentionMatcher.exec(args);
    let ret = null;

    if (idMatch) { // Found the user by mention or raw ID
      ret = this.msg.channel.guild.members.get(idMatch[1]);
    } else { // Find the user by their username (and discrim?)
      if (args.length > 5 && args.slice(-5, -4) === '#') { // we have a discrim
        ret = this.msg.channel.guild.members.find(member => `${member.username}#${member.discriminator}` === args || `${member.nick}#${member.discriminator}` === args);
      } else {
        ret = this.msg.channel.guild.members.find(member => member.username === args || member.nick === args);
      }
    }

    if (!ret && !consumeOnFail) {
      this.args.unshift(...args.split(' '));
    }

    return ret ? ret.user : null;
  }

  /**
   * Resolves a channel using the next argument in the list or all remaining arguments
   * @param {Boolean} consumeRest Whether to use the rest of the arguments to resolve the channel or not
   * @return {Null|TextChannel|VoiceChannel} Null if the argument couldn't be resolved, otherwise the channel object
   */
  resolveChannel (consumeRest = false, consumeOnFail = true) {
    const args = consumeRest
      ? this.args.splice(0).join(' ')
      : this.args.shift();

    if (!args) {
      return null; // We have nothing to resolve a user with
    }

    const idMatch = idMatcher.exec(args) || channelMentionMatcher.exec(args);
    let ret = null;

    if (idMatch) {
      ret = this.bot.getChannel(idMatch[1]);
      if (ret.type === 4) {
        ret = null; // If the channel is a category, don't pick it up
      }
    } else {
      if (!this.msg.channel.guild) {
        ret = null; // Only allow name-lookup for channels locally due to the performance impact this would have for searching lots of guilds
      } else {
        ret = this.msg.channel.guild.channels.find(channel => channel.name === args && channel.type !== 4);
      }
    }

    if (!ret && !consumeOnFail) {
      this.args.unshift(...args.split(' '));
    }

    return ret;
  }

  /**
   * Resolves a role using the next argument in the list or all remaining arguments
   * @param {Boolean} consumeRest Whether to use the rest of the arguments to resolve the role or not
   * @return {Null|Role} Null if the argument couldn't be resolved, otherwise the role object
   */
  resolveRole (consumeRest = false) {
    const args = consumeRest
      ? this.args.splice(0).join(' ')
      : this.args.shift();

    if (!this.msg.channel.guild || !args) {
      return null;
    }

    const idMatch = idMatcher.exec(args) || roleMentionMatcher.exec(args);

    if (idMatch) {
      return this.msg.channel.guild.roles.get(idMatch[1]);
    } else {
      return this.msg.channel.guild.roles.find(role => role.name === args);
    }
  }

  /**
   * Resolves multiple users by consuming the remaining arguments
   * @return {Array<User>} An array of user objects. Could be empty.
   */
  resolveUsers () {
    const resolved = [];

    let user;

    while ((user = this.resolveUser(false)) !== null) {
      resolved.push(user);
    }

    return resolved;
  }

  /**
   * Returns the next word(s) in the argument list
   * @param {Boolean} consumeRest Whether to return the remaining arguments or a single argument
   * @return {Null|String} Null if the arg list is empty, otherwise the arguments
   */
  nextArgument (consumeRest = false) {
    return consumeRest ? this.args.splice(0).join(' ') : this.args.shift();
  }

  /**
   * Returns the arguments with cleaned mentions
   * @param {Boolean} consumeRest Whether to use the remaining arguments or a single argument
   * @return {Null|String} Null if the arg list is empty, otherwise the cleaned arguments
   */
  cleanContent (consumeRest = false) {
    let args = consumeRest
      ? this.args.splice(0).join(' ')
      : this.args.shift();

    if (!args) {
      return null;
    }

    let match;

    while ((match = userMentionMatcher.exec(args)) !== null) { // Clean user mentions
      const user = this.msg.channel.guild
        ? this.msg.channel.guild.members.get(match[1])
        : this.bot.users.get(match[1]);

      const formatted = user ? `@${user.nick || user.username}` : '@deleted-user';
      args = args.replace(match[0], formatted);
    }

    while ((match = channelMentionMatcher.exec(args)) !== null) { // Clean channel mentions
      const channel = this.msg.channel.guild.channels.get(match[1]);
      const formatted = channel ? `#${channel.name}` : '#deleted-channel';
      args = args.replace(match[0], formatted);
    }

    while ((match = roleMentionMatcher.exec(args)) !== null) { // Clean role mentions
      const role = this.msg.channel.guild.roles.get(match[1]);
      const formatted = role ? `@${role.name}` : '@deleted-role';
      args = args.replace(match[0], formatted);
    }

    args = args.replace('@everyone', '@\u200Beveryone')
      .replace('@here', '@\u200Bhere'); // Clean everyone/here mentions

    return args;
  }

  /**
   * Check if the message does not contain any args
   * @type {Boolean}
   */
  get isEmpty () {
    return !this.args[0];
  }

  /**
   * Get the total length of the args
   * @type {Number}
   */
  get textLength () {
    return this.args.join(' ').length;
  }

  /**
   * Get the argument at the given index
   * @param {Number} [index=0] - The index, defaults to `0`
   * @returns {String} The argument
   */
  getArgument (index = 0) {
    return this.args[index];
  }

  /**
   * Returns the merged arguments
   * @returns {String} The arguments
   */
  gather () {
    return this.args.join(' ');
  }

  /**
   * Drops the argument at the given index
   * @param {Number} index - The index of the argument to drop
   * @returns {void}
   */
  drop (index) {
    this.args.splice(index, 1);
  }
}

module.exports = ArgParser;
