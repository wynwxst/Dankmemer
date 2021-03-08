const { GenericCommand } = require('.')

class GenericImageCommand {
  constructor (commandProps, URLParseFN) {
    this.cmdProps = commandProps
    this.URLParseFN = URLParseFN || this.defaultURLParseFN
    this.requestURL = commandProps.reqURL || 'http://127.0.0.1:65535/api/$ENDPOINT'
  }

  async run ({ Memer, msg, addCD }) {
    const datasrc = this.URLParseFN(msg)
    if (!datasrc) {
      return
    }

    const data = await Memer.http.get(this.requestURL.replace('$ENDPOINT', this.cmdProps.triggers[0]))
      .set('Authorization', Memer.config.imgenKey)
      .query(datasrc)

    if (data.status === 200 && data.headers['content-type'].startsWith('image/')) {
      await addCD()
      msg.channel.createMessage('', {
        file: data.body,
        name: `${this.cmdProps.triggers[0]}.${this.cmdProps.format || 'png'}`
      })
    } else {
      msg.channel.createMessage(`Something went wrong while executing this hecking command!\`\`\`\n${data.text}\`\`\`\n\nJoin here (<https://discord.gg/ebUqc7F>) if the issue doesn't stop being an ass`)
    }
  }

  defaultURLParseFN (msg) {
    if (this.cmdProps.requiredArgs) {
      if (msg.args.isEmpty()) {
        msg.channel.createMessage(this.cmdProps.requiredArgs)
        return false
      }

      if (msg.args.textLength() > this.cmdProps.textLimit) {
        msg.channel.createMessage(`Too long. You're ${msg.args.textLength() - this.cmdProps.textLimit} characters over the limit!`)
        return false
      }
    }

    let ret = {}

    if (this.cmdProps.textOnly) {
      ret.text = msg.args.cleanContent(true)
    } else {
      const argIsUrl = (msg.args.getArgument(0) || '').replace(/[<>]/g, '').match(/^https?:\/\/.+\.(?:jpg|jpeg|gif|png)$/i)

      if (this.cmdProps.doubleAvatar) {
        if (argIsUrl) {
          ret.avatar2 = argIsUrl[0]
          msg.args.drop(1)
        } else {
          let parsedUser = msg.args.resolveUser(false)
          let parsedUser2 = msg.args.resolveUser(false)
          let user
          let user2

          user = parsedUser || msg.channel.guild.shard.client.user
          user = (!parsedUser2 && parsedUser) ? msg.author : user

          user2 = parsedUser2 || parsedUser || msg.author

          ret.avatar1 = user.dynamicAvatarURL('png', 1024)
          ret.username1 = user.username
          ret.avatar2 = user2.dynamicAvatarURL('png', 1024)
          ret.username2 = user2.username
        }
      } else {
        if (argIsUrl) {
          ret.avatar1 = argIsUrl[0]
          msg.args.drop(0)
        } else {
          const user = msg.args.resolveUser(!(!!this.cmdProps.textLimit && !this.cmdProps.textOnly), false) || msg.author
          ret.avatar1 = user.dynamicAvatarURL('png', 1024)
          ret.username1 = user.username
        }
        if (this.cmdProps.requiredArgs) {
          ret.text = msg.args.cleanContent(true)
        }
      }
    }

    return ret
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 3000,
        donorCD: 1000,
        perms: ['embedLinks', 'attachFiles']
      }, this.cmdProps)
    ).props
  }
}

module.exports = GenericImageCommand
