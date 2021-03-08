module.exports = {
  help: 'change bot status',
  fn: async ({ Memer, args }) => {
    Memer.bot.editStatus(null, {
      name: args.join(' '),
      type: 0
    })
    return `Status was updated: ${args.join(' ')}`
  }
}
