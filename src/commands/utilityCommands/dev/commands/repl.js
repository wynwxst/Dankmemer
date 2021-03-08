const { inspect } = require('util');
const ProgrammaticREPL = require('programmatic-repl');

module.exports = {
  help: 'repl',
  fn: async ({ Memer, msg }) => {
    if (!Memer.config.options.owners.includes(msg.author.id)) {
      return 'Woah now, only my "Owners" can do this';
    }
    const REPL = new ProgrammaticREPL({
      includeNative: true,
      includeBuiltinLibs: true,
      stringifyResults: true,
      name: 'dank.repl'
    }, {
      Memer,
      get top () {
        return Memer.db.topPocket();
      }
    });

    const runCommand = async () => {
      const commandMsg = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, 60e3);
      if (!commandMsg) {
        return msg.channel.createMessage('Timed out, automatically exiting REPL...');
      }

      const { content } = commandMsg;

      if (content.startsWith('//')) {
        return runCommand();
      }
      if (commandMsg.content === '.exit') {
        return msg.channel.createMessage('Successfully exited.');
      }

      REPL.ctx.msg = commandMsg;
      let before, after;

      let result;
      try {
        before = process.hrtime();
        result = await REPL.execute(commandMsg.content);
        after = process.hrtime(before);
        after = after[0]
          ? `${(after[0] + after[1] / 1e9).toLocaleString()}s`
          : `${(after[1] / 1e3).toLocaleString()}μs`;
      } catch (e) {
        const error = e.stack || e;
        result = `ERROR:\n${typeof error === 'string' ? error : inspect(error, { depth: 1 })}`;
      }

      if (typeof result !== 'string') {
        result = inspect(result, {
          depth: +!(inspect(result, { depth: 1, showHidden: true }).length > 1990), // Results in either 0 or 1
          showHidden: true
        });
      }

      result = result.replace(new RegExp(Memer.secrets.bot.token, 'gi'), 'i think the fuck not, you trick ass bitch');

      if (result.length > 1950) {
        // If it's over the 2k char limit, we break off the result, pop the last line and close off
        result = result.slice(0, 1950).split('\n');
        result.pop();
        result = result.join('\n') + '\n\n...';
      }

      msg.channel.createMessage('```js\n' + result + '\n```\n' + `*Execution took ${after}*`);
      runCommand();
    };

    runCommand();
    return 'REPL started. Available commands:\n```\n.exit\n.clear\n_\n```';
  }
};
