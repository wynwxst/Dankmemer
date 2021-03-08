const GenericModerationCommand = require('../../models/GenericModerationCommand');

module.exports = new GenericModerationCommand(
  async ({ Memer, msg, args }) => {
    let biggay = msg.channel.guild.roles.find(r => r.name === 'big gay');
    const reason = `\`biggay\` - ran by ${msg.author.username}#${msg.author.discriminator}`;
    let member = Memer.randomInArray(msg.channel.guild.members.filter(member => member.id !== Memer.bot.user.id && member.id !== msg.channel.guild.ownerID && (biggay ? !member.roles.includes(biggay.id) : true)));
    if (!member) {
      return 'There\'s nobody that I can give the big gay to!';
    }

    const memberHighestRole = member.roles.map(r => msg.channel.guild.roles.get(r)).sort((a, b) => a.position - b.position)[0] || msg.channel.guild.roles.get(msg.channel.guild.id);
    const botRole = msg.channel.guild.members.get(Memer.bot.user.id).roles.map(r => msg.channel.guild.roles.get(r)).sort((a, b) => a.position - b.position)[0] || msg.channel.guild.roles.get(msg.channel.guild.id);
    const hahayes = `${member.user.username}#${member.user.discriminator}`;
    if (memberHighestRole.position >= botRole.position) {
      return `I can't give ${hahayes} the big gay because they have an equal or higher role compared to me!`;
    }

    const addBigGay = (role) => {
      member.addRole(role.id, reason)
        .then(() => {
          msg.channel.createMessage(`${hahayes} now has the **big gay**`);
        })
        .catch(() => {
          msg.channel.createMessage(`I wasn't able to add the big gay role to **${hahayes}**. Make sure that they don't have a higher role than me, and that I have the correct permissions to add roles to people (\`Manage Roles\`)`);
        });
    };

    if (!biggay) {
      msg.channel.guild.createRole({ name: 'big gay', hoist: true, color: '16056407' }, reason)
        .then(async (role) => {
          await role.editPosition(botRole.position - 1);
          addBigGay(role);
        })
        .catch(() => {
          msg.channel.createMessage(`I wasn't able to add the big gay role to **${hahayes}**. Check that I have the correct permissions to add and edit roles and try again.`);
        });
    } else {
      addBigGay(biggay);
    }
  }, {
    triggers: ['biggay'],
    usage: '{command}',
    description: 'Give somebody the big gay',
    perms: ['manageRoles'],
    modPerms: ['manageRoles']
  }
);
