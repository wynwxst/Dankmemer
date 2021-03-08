const { exec } = require('child_process');

module.exports = {
  help: 'reboot <shard | all>',
  fn: async ({ Memer, msg, args }) => {
    if (!Memer.config.options.owners.includes(msg.author.id)) {
      return 'Woah now, only my "Owners" can do this';
    }
    if (['cluster', 'all'].includes(args[0])) {
      const m = await msg.channel.createMessage(`confirm reboot? \`y\`/\`n\``);

      const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 5e4);
      if (!choice || choice.content.toLowerCase() !== 'y') {
        return m.edit('whew, dodged a bullet');
      }
    }

    if (args[0] === 'cluster') {
      if (args[1]) {
        await msg.channel.createMessage(`Rebooting cluster ${args[1]}`);
        return Memer.restartCluster(args[1]);
      }
      await msg.channel.createMessage('Rebooting this cluster...');
      process.exit();
    } else if (args[0] === 'all') {
      await msg.channel.createMessage('All clusters rebooting...');
      exec('pm2 restart memer', () => { msg.channel.createMessage('Huh?'); });
    } else {
      return 'Please specify a type of reboot, `cluster [id]` or `all`.';
    }
  }
};
