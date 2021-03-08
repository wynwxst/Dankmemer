module.exports = {
  help: 'change bot avatar',
  fn: async ({ Memer, args }) => {
    await setAvatar(Memer, args.join(' '))
    return `avatar was updated: ${args.join(' ')}`
  }
}

async function setAvatar (Memer, url) {
  const { body, headers } = await Memer.http.get(url)
  Memer.bot.editSelf({ avatar: `data:${headers['content-type']};base64,${body.toString('base64')}` })
}
