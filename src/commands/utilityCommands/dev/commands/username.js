module.exports = {
  help: 'change bot username',
  fn: async ({ Memer, args }) => {
    await Memer.bot.editSelf({username: args.join(' ')})
    return `username was updated to **${args.join(' ')}**`
  }
}
