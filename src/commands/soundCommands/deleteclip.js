const GenericCommand = require('../../models/GenericCommand');
const { exists, removeFile } = require('../../utils/audioUtils.js');
const basePath = `${process.cwd()}/assets/audio/custom`;

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const fileName = msg.args.nextArgument();

    if (!await exists(`${basePath}/${msg.author.id}/${fileName}.opus`)) {
      return 'No clips found with that name. SAD!';
    }

    try {
      await removeFile(`${basePath}/${msg.author.id}/${fileName}.opus`);
      return 'K, removed that clip';
    } catch (e) {
      return `Well damn, that clip couldn't be removed\n\`\`\`\n${e.message}\`\`\`\n\nJoin here (https://discord.gg/Wejhbd4) if the issue doesn't stop being an ass`;
    }
  },
  {
    triggers: ['deleteclip'],
    usage: '{command} <clipname>',
    description: 'Removes a custom sound clip',
    ownerOnly: true
  }
);
