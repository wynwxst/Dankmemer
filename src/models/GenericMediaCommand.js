const { GenericCommand } = require('.')

module.exports = class GenericMediaCommand {
  constructor (cmdProps) {
    this.cmdProps = cmdProps
  }

  async run ({ Memer, msg, addCD }) {
    let voted = await Memer.db.checkVoter(msg.author.id)
    if (this.props.voter && !voted) {
      return `**WOAH** you need to vote at https://discordbots.org/bot/memes/vote to use this command.\n${this.props.vMessage}`
    }

    const data = await Memer.http.get(this.props.reqURL, this.props.tokenKey && {
      headers: {
        Authorization: Memer.config[this.props.tokenKey],
        Key: Memer.config[this.props.tokenKey]
      }
    })
      .then(res => this.props.JSONKey ? res.body[this.props.JSONKey] : res.text)

    if (data.endsWith('.mp4')) {
      return this.run({ Memer, msg, addCD })
    }

    await addCD()
    return {
      title: this.props.title,
      image: { url: `${this.props.prependURL || ''}${data}` },
      footer: { text: `${msg.author.username}#${msg.author.discriminator}${this.props.message ? ` | ${this.props.message}` : ''}` }
    }
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 2000,
        donorCD: 500,
        perms: ['embedLinks']
      }, this.cmdProps)
    ).props
  }
}
