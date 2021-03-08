const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` to enable commands.';
    }

    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || await Memer.db.createGuild(msg.channel.guild.id);

    if (!args[0]) {
      return { content: `Specify a command/category to enable, or multiple.\n\nExample: \`${gConfig.prefix} enable meme trigger shitsound\` or \`${gConfig.prefix} enable meme\`
      \nYou can also enable categories by specifying the category name, for example: \`${gConfig.prefix} enable nsfw\``,
      reply: true };
    }

    const categories = Memer.cmds.map(c => c.category.split(' ')[1].toLowerCase());
    if (args.some(cmd => !Memer.cmds.find(c => c.props.triggers.includes(cmd)) && !categories.includes(cmd))) {
      return `The following commands or categories are invalid: \n\n${args.filter(cmd => !Memer.cmds.find(c => c.props.triggers.includes(cmd)) && !categories.includes(cmd)).map(cmd => `\`${cmd}\``).join(', ')}\n\nPlease make sure all of your commands are valid and try again.`;
    }

    args = Memer.removeDuplicates(args
      .map(cmd => {
        return (Memer.cmds.find(c => c.props.triggers.includes(cmd)) || { props: { triggers: [cmd] } }).props.triggers[0];
      }));

    gConfig.enabledCommands = gConfig.enabledCommands || [];
    gConfig.disabledCategories = gConfig.disabledCategories || [];
    gConfig.enabledCategories = gConfig.enabledCategories || [];
    const arentDisabled = args.filter(cmd => gConfig.enabledCommands.includes(cmd) || gConfig.enabledCategories.includes(cmd));
    if (arentDisabled[0]) {
      return `These commands/categories aren't disabled:\n\n${arentDisabled.map(c => `\`${c}\``).join(', ')}\n\nHow tf do you plan to enable already enabled stuff??`;
    }
    args.map(cmd => {
      if (categories.includes(cmd)) {
        gConfig.disabledCategories.splice(gConfig.disabledCategories.indexOf(cmd), 1);
      } else {
        gConfig.enabledCommands = gConfig.enabledCommands.concat(cmd);
        if (gConfig.disabledCommands.indexOf(cmd) > -1) {
          gConfig.disabledCommands.splice(gConfig.disabledCommands.indexOf(cmd), 1);
        }
      }
    });

    await Memer.db.updateGuild(gConfig);

    return `The following commands/categories have been enabled successfully:\n\n${args.map(cmd => `\`${cmd}\``).join(', ')}`;
  }, {
    triggers: ['enable'],
    description: 'Use this command to enable disabled commands or categories.'
  }
);
