/** @typedef {import('./GenericCommand').CommandProps} CommandProps */

const GenericCommand = require('./GenericCommand');

class GenericImageCommand {
  /**
   * @param {CommmandProps} commandProps
   * @param {Function} URLParseFN
   */
  constructor (commandProps, URLParseFN) {
    this.cmdProps = commandProps;
    this.URLParseFN = URLParseFN || this.defaultURLParseFN;
    this.requestURL = commandProps.reqURL || 'http://127.0.0.1:65535/api/$ENDPOINT';
  }

  async run ({ Memer, msg, addCD }) {
    const datasrc = this.URLParseFN(msg);
    if (!datasrc) {
      return;
    }

    const data = await Memer.http.get(this.requestURL.replace('$ENDPOINT', this.cmdProps.triggers[0]))
      .set('Authorization', Memer.secrets.memerServices.imgenKey)
      .query(datasrc);

    if (data.ok && data.headers['content-type'].startsWith('image/')) {
      await addCD();
      msg.channel.createMessage('', {
        file: data.body,
        name: `${this.cmdProps.triggers[0]}.${this.cmdProps.format || 'png'}`
      });
    } else {
      msg.channel.createMessage(`Something went wrong while executing this hecking command!\n\nJoin here (<https://discord.gg/Wejhbd4>) if the issue doesn't stop being an ass`);
    }
  }

  defaultURLParseFN (msg) {
    if (this.cmdProps.requiredArgs) {
      if (msg.args.isEmpty) {
        msg.channel.createMessage(this.cmdProps.requiredArgs);
        return false;
      }

      if (typeof this.cmdProps.textLimit === 'number') {
        if (msg.args.textLength > this.cmdProps.textLimit) {
          msg.channel.createMessage(`Too long. You're ${msg.args.textLength - this.cmdProps.textLimit} characters over the limit!`);
          return false;
        }
      } else {
        const sections = msg.content.split(', ');
        const limits = this.cmdProps.textLimit;
        if (sections.length !== limits.length) {
          msg.channel.createMessage(`You need to supply ${limits.length} arguments separated by \`, \u200b\`! You gave ${sections.length}.`);
          return false;
        }

        const maybeError = sections
          .map((section, i) => (section.length <= limits[i]) || `Argument number ${i + 1} is ${section.length - limits[i]} characters over the limit!`)
          .find((result) => typeof result === 'string');

        if (maybeError) {
          msg.channel.createMessage(maybeError);
          return false;
        }
      }
    }

    let ret = {};

    if (this.cmdProps.textOnly) {
      ret.text = msg.args.cleanContent(true);
    } else {
      const argIsUrl = (msg.args.getArgument(0) || '').replace(/[<>]/g, '').match(/^https?:\/\/.+\.(?:jpg|jpeg|gif|png)$/i);

      if (this.cmdProps.doubleAvatar) {
        if (argIsUrl) {
          ret.avatar2 = argIsUrl[0];
          msg.args.drop(1);
        } else {
          let parsedUser = msg.args.resolveUser(false);
          let parsedUser2 = msg.args.resolveUser(false);
          let user;
          let user2;

          user = parsedUser || msg.channel.guild.shard.client.user;
          user = (!parsedUser2 && parsedUser) ? msg.author : user;

          user2 = parsedUser2 || parsedUser || msg.author;

          ret.avatar1 = user.dynamicAvatarURL('png', 1024);
          ret.username1 = user.username;
          ret.avatar2 = user2.dynamicAvatarURL('png', 1024);
          ret.username2 = user2.username;
        }
      } else {
        if (argIsUrl) {
          ret.avatar1 = argIsUrl[0];
          msg.args.drop(0);
        } else {
          const user = msg.args.resolveUser(!(!!this.cmdProps.textLimit && !this.cmdProps.textOnly), false) || msg.author;
          ret.avatar1 = user.dynamicAvatarURL('png', 1024);
          ret.username1 = user.username;
        }
        if (this.cmdProps.requiredArgs) {
          ret.text = msg.args.cleanContent(true);
        }
      }
    }

    return ret;
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000,
        perms: ['embedLinks', 'attachFiles']
      }, this.cmdProps)
    ).props;
  }
}

module.exports = GenericImageCommand;
