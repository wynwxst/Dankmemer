const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` to disable commands.';
    }

    const gConfig = await Memer.db.getGuild(msg.channel.guild.id) || {
      prefix: Memer.config.options.prefix,
      swearFilter: false
    };

    if (!gConfig.swearFilter) { // picks up undefined and null
      gConfig.swearFilter = false;
    }

    gConfig.swearFilter = !gConfig.swearFilter;
    if (gConfig.swearFilter) {
      msg.channel.createMessage('No more swear words in this christian server :sunglasses:');
    } else {
      msg.channel.createMessage('Swearing is now allowed :rage:');
    }

    await Memer.db.updateGuild(gConfig);
  }, {
    triggers: ['noswears', 'noswear', 'swearfilter', 'toggleswear'],
    usage: '{command}',
    description: 'NO SWEARS IN THIS CHRISTIAN SERVER'
  }
);
