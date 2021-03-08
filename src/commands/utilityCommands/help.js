const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    const commands = Memer.cmds.filter(cmd => !cmd.props.ownerOnly && !cmd.props.hide);
    const db = await Memer.db.getGuild(msg.channel.guild.id);
    const prefix = db ? db.prefix : Memer.config.options.prefix;
    let help = Memer.config.options.helpCommand || {
      'title': 'no title for you',
      'message': 'no message for you',
      'footer': 'no footer for you'
    };

    if (msg.args.isEmpty) {
      let categories = {};
      let description = {};
      for (const command of commands) {
        let category = categories[command.category] = (categories[command.category] || []);
        description[command.category] = description[command.category] || command.description;
        category.push(command.props.triggers[0]);
      }
      return {
        title: help.title,
        description: help.message,
        fields: Object.keys(categories).sort((a, b) => categories[b].length - categories[a].length).map(category => ({ name: `${category}`, value: `\`${prefix} help ${category.split(' ')[1].toLowerCase()}\`\n[Hover for info](https://gist.github.com/melmsie/e36d102e7871a0bf6d007198b0d0ae05 '${description[category]}\n${categories[category].length} total commands')`, inline: true })),
        footer: { text: help.footer }
      };
    }

    const command = Memer.cmds.find(c => c.props.triggers.includes(args[0].toLowerCase()));
    const categorySearch = Memer.cmds.find(c => c.category.split(' ')[1].toLowerCase() === args[0].toLowerCase());

    await addCD();
    if (command && !categorySearch) {
      return {
        fields: [
          { 'name': 'Description:', 'value': command.props.description },
          { 'name': 'Usage:', 'value': `\`${command.props.usage.replace('{command}', `${prefix} ${command.props.triggers[0]}`)}\`` },
          { 'name': 'Aliases:', 'value': command.props.triggers.join(', ') }
        ]
      };
    } else if (categorySearch) {
      let categories = {};
      let donorCategories = {};
      for (const command of commands) {
        let category = categories[command.category] = (categories[command.category] || []);
        let donorCategory = donorCategories[command.category] = (donorCategories[command.category] || []);
        if (!command.props.donorOnly) {
          category.push(command.props.triggers[0]);
        } else {
          donorCategory.push(command.props.triggers[0]);
        }
      }
      const categoryName = Object.keys(categories).find(c => c.split(' ')[1].toLowerCase() === args[0].toLowerCase());
      const categoryCommands = categories[categoryName];
      const donorCommands = donorCategories[categoryName];

      if (!categoryCommands) {
        return 'that\'s not a valid category smh';
      }
      let dComm;
      if (!donorCommands || donorCommands.length < 1) {
        dComm = '';
      } else {
        dComm = `\n\n**[Premium Only](https://www.patreon.com/dankmemerbot)**\n${donorCommands.join(', ')}`;
      }

      return {
        title: categoryName + ' Commands',
        description: categoryCommands.join(', ') + dComm,
        footer: { text: `use ${prefix} before each command!` }
      };
    }
  },
  {
    triggers: ['help', 'cmds', 'commands'],
    description: 'See a list of commands available.',
    perms: ['embedLinks']
  }
);
