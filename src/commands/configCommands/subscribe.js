const { GenericCommand } = require('../../models');

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!msg.member.permission.has('manageGuild') && !Memer.config.options.developers.includes(msg.author.id)) {
      return 'You are not authorized to use this command. You must have `Manage Server` to set the updates channel.';
    }
    let channel = msg.args.resolveChannel(false, false);
    if (channel) {
      await Memer.db.updateDevSubscriber(msg.channel.guild.id, channel.id);
      return `ey, your update channel is now <#${channel.id}>, you will now get the best updates world wide`;
    } else {
      await Memer.db.deleteDevSubscriber(msg.channel.guild.id);
      return 'Ok since I did not detect a channel mention in this command, I\'m gonna assume you wanted no update channel?';
    }
  }, {
    triggers: ['subscribe'],
    usage: '{command} [#channel]',
    description: 'Mention a channel to set/update a updates channel, say literally anything else and remove an existing updates channel'
  }
);
