module.exports = {
  help: 'reload [most | commands | config]',
  fn: async ({ Memer, msg, args }) => {
    if (['most', 'commands', 'config'].includes(args[0])) {
      const m = await msg.channel.createMessage(`confirm spicy reload? \`y\`/\`n\``);

      const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 5e4);
      if (!choice || choice.content.toLowerCase() !== 'y') {
        return m.edit('whew, dodged a bullet');
      }
    }

    switch (args[0]) {
      case 'most':
        try {
          Memer.ipc.broadcast('reloadMost', {});
          return 'Successfully reloaded basically everything besides the main class';
        } catch (err) {
          return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``;
        }

      case 'commands':
        try {
          Memer.ipc.broadcast('reloadCommands', {});
          return 'Successfully reloaded all commands!!!!';
        } catch (err) {
          return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``;
        }

      case 'config':
        try {
          Memer.ipc.broadcast('reloadConfig', {});
          return 'Successfully reloaded config file.';
        } catch (err) {
          return `We had a hecking error: \n\`\`\`${err.stack || err.message || err}\`\`\``;
        }

      default:
        return '[most | commands | config]';
    }
  }
};
