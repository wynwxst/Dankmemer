const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let perms = msg.channel.permissionsOf(msg.author.id);
    if (!perms.has('manageGuild')) {
      return 'lol you do not have manage server perms and you know it';
    }

    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || {
      prefix: Memer.config.options.prefix,
      disabledCommands: [],
      disabledCategories: [],
      enabledCommands: [],
      autoResponse: {
        dad: false,
        ree: false,
        sec: false,
        nou: false
      }
    };

    if (!gConfig.autoResponse) {
      gConfig.autoResponse = {
        dad: false,
        ree: false,
        sec: false,
        nou: false
      };
    }

    switch (msg.args.args[0].toLowerCase()) {
      case 'dadmode':
        if (!gConfig.autoResponse.dad) {
          gConfig.autoResponse.dad = true;
          await Memer.db.updateGuild(gConfig);
          return 'Dad mode has been enabled on this server. Try it out by saying "I\'m stupid".';
        } else {
          gConfig.autoResponse.dad = false;
          await Memer.db.updateGuild(gConfig);
          return 'Dad mode has been disabled on this server. Thanks for nothing, stupid.';
        }

      case 'ree':
        if (!gConfig.autoResponse.ree) {
          gConfig.autoResponse.ree = true;
          await Memer.db.updateGuild(gConfig);
          return 'REE mode has been enabled on this server. Try it out by saying "ree".';
        } else {
          gConfig.autoResponse.ree = false;
          await Memer.db.updateGuild(gConfig);
          return 'REE mode has been disabled on this server. Thanks for nothing, stupid.';
        }

      case 'sec':
        if (!gConfig.autoResponse.sec) {
          gConfig.autoResponse.sec = true;
          await Memer.db.updateGuild(gConfig);
          return 'Second mode has been enabled on this server. Try it out by saying "one second".';
        } else {
          gConfig.autoResponse.sec = false;
          await Memer.db.updateGuild(gConfig);
          return 'Second mode has been disabled on this server. Thanks for nothing, stupid.';
        }

      case 'nou':
        if (!gConfig.autoResponse.nou) {
          gConfig.autoResponse.nou = true;
          await Memer.db.updateGuild(gConfig);
          return 'NO U mode has been enabled on this server. Try it out by saying "no u".';
        } else {
          gConfig.autoResponse.nou = false;
          await Memer.db.updateGuild(gConfig);
          return 'NO U mode has been disabled on this server. Thanks for nothing, stupid.';
        }

      default:
        return 'You need to specify which autoresponse to turn off.\n`dadmode`, `ree`, `sec`, or `NoU`';
    }
  }, {
    triggers: ['autoresponse', 'ar'],
    usage: '{command} [autoreponse choice]',
    missingArgs: 'You need to specify which autoresponse to turn off.\n`dadmode`, `ree`, `sec`, or `NoU`',
    description: 'Decide whether to enable or disable certain autoresponses on this server'
  }
);
