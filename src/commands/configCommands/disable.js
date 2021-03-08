const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` to disable commands.';
    }

    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || await Memer.db.createGuild(msg.channel.guild.id);

    if (!args[0]) {
      return { content: `Specify a command to disable, or multiple.\n\nExample: \`${gConfig.prefix} disable meme trigger shitsound\` or \`${gConfig.prefix} disable meme\`
      \nYou can also disable categories by specifying the category name, for example: \`${gConfig.prefix} disable nsfw\``,
      reply: true };
    }

    const categories = Memer.cmds.map(c => c.category.split(' ')[1].toLowerCase());
    const invalid = args.filter(cmd => (!Memer.cmds.find(c => c.props.triggers.includes(cmd)) && !categories.includes(cmd)) || ['disable', 'enable'].includes(cmd));
    if (invalid.length) {
      return { content: `The following commands or categories are invalid: \n\n${invalid.map(cmd => `\`${cmd.toLowerCase()}\``).join(', ')}\n\nPlease make sure all of your commands or categories are valid (case-sensitive!) and try again.`, reply: true };
    }

    args = Memer.removeDuplicates(args
      .map(cmd => {
        return (Memer.cmds.find(c => c.props.triggers.includes(cmd)) || { props: { triggers: [cmd] } }).props.triggers[0];
      }));

    gConfig.disabledCategories = gConfig.disabledCategories || [];
    gConfig.enabledCommands = gConfig.enabledCommands || [];

    const alreadyDisabled = args.filter(cmd => gConfig.disabledCommands.includes(cmd) || gConfig.disabledCategories.includes(cmd));
    if (alreadyDisabled[0]) {
      return `These commands/categories are already disabled:\n\n${alreadyDisabled.map(c => `\`${c}\``).join(', ')}\n\nHow tf do you plan to disable stuff that's already disabled??`;
    }

    args.map(cmd => {
      if (categories.includes(cmd)) {
        gConfig.disabledCategories = gConfig.disabledCategories.concat(cmd);
      } else {
        gConfig.disabledCommands = gConfig.disabledCommands.concat(cmd);
        if (gConfig.enabledCommands.indexOf(cmd) > -1) {
          gConfig.enabledCommands.splice(gConfig.enabledCommands.indexOf(cmd), 1);
        }
      }
    });

    await Memer.db.updateGuild(gConfig);

    return `The following commands/categories have been disabled successfully:\n\n${args.map(cmd => `\`${cmd}\``).join(', ')}`;
  }, {
    triggers: ['disable'],
    description: 'Use this command to disable commands or categories you do not wish for your server to use'
  }
);
