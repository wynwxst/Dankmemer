module.exports = class GenericCommand {
  constructor (fn, props) {
    this.fn = fn
    this.cmdProps = props
  }

  async run ({ Memer, msg, args, addCD, cleanArgs }) {
    if (this.props.missingArgs && !args[0]) {
      return this.props.missingArgs
    }
    if (this.props.minArgs && args.length < this.props.minArgs) {
      return this.props.missingArgs
    }
    return this.fn({ Memer, msg, args, addCD, cleanArgs })
  }

  get props () {
    return Object.assign({
      usage: '{command}',
      cooldown: 2000,
      donorCD: 500,
      isNSFW: false,
      ownerOnly: false
    }, this.cmdProps, {
      perms: ['sendMessages'].concat(this.cmdProps.perms || [])
    })
  }
}
