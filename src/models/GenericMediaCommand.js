/** @typedef {import('./GenericCommand').CommandProps} CommandProps */

const GenericCommand = require('./GenericCommand');

class GenericMediaCommand {
  /**
   * @param {CommmandProps} commandProps
   */
  constructor (cmdProps) {
    this.cmdProps = cmdProps;
  }

  async run ({ Memer, msg, addCD }) {
    let user = await Memer.db.getUser(msg.author.id);
    if (this.props.voter && !user.dblUpvoted) {
      return `**WOAH** you need to vote at https://discordbotlist.com/bots/270904126974590976 to use this command.\n${this.props.vMessage}`;
    }

    const data = await Memer.http.get(this.props.reqURL, this.props.tokenKey && {
      headers: {
        Authorization: Memer.secrets.extServices[this.props.tokenKey],
        Key: Memer.secrets.extServices[this.props.tokenKey]
      }
    })
      .then(res => this.props.JSONKey ? res.body[this.props.JSONKey] : res.body);

    await addCD();
    return {
      title: this.props.title,
      image: { url: `${this.props.prependURL || ''}${data}` },
      footer: { text: `${msg.author.username}#${msg.author.discriminator}${this.props.message ? ` | ${this.props.message}` : ''}` }
    };
  }

  get props () {
    return new GenericCommand(
      null,
      Object.assign({
        cooldown: 2000,
        donorCD: 500,
        perms: ['embedLinks']
      }, this.cmdProps)
    ).props;
  }
}

module.exports = GenericMediaCommand;
