module.exports = {
  help: 'bl <id> <reason>',
  fn: async ({ Memer, msg }) => {
    let [type, id, ...reason] = msg.args.args
    if (!Number(id)) {
      msg.channel.createMessage('Your first argument needs to be an id.')
    }
    if (!type) {
      type = 'user'
    }
    if (!reason || reason.length === 0) {
      reason = `No reason given.\nBlacklisted by ${msg.author.username}`
    } else {
      reason = reason.join(' ') + `\nBlacklisted by ${msg.author.username}`
    }
    Memer.punish(Memer, id, type, reason, true, false)
  }
}
