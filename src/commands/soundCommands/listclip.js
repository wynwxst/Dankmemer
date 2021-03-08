const GenericCommand = require('../../models/GenericCommand');
const { getFiles } = require('../../utils/audioUtils.js');
const basePath = `${process.cwd()}/assets/audio/custom`;

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const files = await getFiles(`${basePath}/${msg.author.id}/`)
      .catch(() => []);

    return files.map(f => `\`${f.split('.')[0]}\``).join(', ') || 'You don\'t have any clips.';
  },
  {
    triggers: ['listclip', 'listclips', 'clips'],
    usage: '{command}',
    description: 'Lists your custom soundclips',
    ownerOnly: true
  }
);
