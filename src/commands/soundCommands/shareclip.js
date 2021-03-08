const GenericCommand = require('../../models/GenericCommand');
const { exists } = require('../../utils/audioUtils.js');
const { promises: fs } = require('fs');
const basePath = `${process.cwd()}/assets/audio/custom`;

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const fileName = msg.args.nextArgument();

    if (!fileName) {
      return 'what clip do you wanna share man I\'m no mind reader';
    }

    if (!await exists(`${basePath}/${msg.author.id}/${fileName}.opus`)) {
      return 'haha that clip doesn\'t exist and you know it';
    }

    const buffer = await fs.readFile(`${basePath}/${msg.author.id}/${fileName}.opus`)
      .catch(err => err.message);

    if (!Buffer.isBuffer(buffer)) {
      return `well damn, something went wrong while trying to upload the file\n\`\`\`\n${buffer}\`\`\`\nJoin here (https://discord.gg/Wejhbd4) if the issue doesn't stop being an ass`;
    }

    msg.channel.createMessage('', {
      name: `${fileName}.opus`,
      file: buffer
    });
  },
  {
    triggers: ['shareclip'],
    usage: '{command} <clipname>',
    description: 'Share your dank clips with others',
    ownerOnly: true
  }
);
