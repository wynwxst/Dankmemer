module.exports = {
  help: 'reload [most | commands | config]',
  fn: async ({ Memer, args }) => {
    Memer.log(args[0])
    switch (args[0]) {
      case 'most':
        try {
          Memer.ipc.broadcast('reloadMost', {})
          return 'Successfully reloaded basically everything besides the main class'
        } catch (err) {
          return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``
        }
        break
      case 'commands':
        try {
          Memer.ipc.broadcast('reloadCommands', {})
          return 'Successfully reloaded all commands!!!!'
        } catch (err) {
          return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``
        }
        break
      case 'config':
        try {
          Memer.ipc.broadcast('reloadConfig', {})
          return 'Successfully reloaded config file.'
        } catch (err) {
          return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``
        }
        break
      default:
        return '[most | commands | config]'
    }
  }
}
