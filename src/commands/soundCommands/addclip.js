const GenericCommand = require('../../models/GenericCommand');
const { exists, isOpus, getFiles, getFileSize, saveAudioData } = require('../../utils/audioUtils.js');
const basePath = `${process.cwd()}/assets/audio/custom`;

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    if (!msg.attachments[0]) {
      return 'Sure, let me just save silence... you need to attach a sound clip.';
    }

    const fileName = msg.args.nextArgument();

    if (!fileName) {
      return 'Whaddya want to call this clip?';
    }

    if (!/^[a-zA-Z0-9]+$/.test(fileName)) {
      return 'filename must be alphanumeric, living in windows 95 era 😤';
    }

    if (await exists(`${basePath}/${msg.author.id}/${fileName}.opus`)) {
      return 'Looks like a clip with that name already exists. SAD!';
    }

    const files = await getFiles(`${basePath}/${msg.author.id}/`)
      .catch(() => []);

    const isDonor = await Memer.db.checkDonor(msg.author.id);
    const maxClips = isDonor ? 10 : 3;

    if (files.length >= maxClips) {
      return `No more clips for you, you've hit the maximum limit of ${maxClips} clips!`;
    }

    const opus = await isOpus(msg.attachments[0].url);

    if (!opus) {
      return 'Nah fam, clip\'s gotta be in opus format 😤 You can download youtube videos as opus from <https://ytdl.serux.pro>';
    }

    const fileSize = await getFileSize(msg.attachments[0].url);

    if (fileSize <= 0) {
      return 'File is too small (!?) what kind of fuckery is this';
    }

    if (fileSize > 131072) { // 128KiB
      return 'woah i\'m not made of space! keep it under 128KB kthx';
    }

    try {
      await saveAudioData(msg.attachments[0].url, `${basePath}/${msg.author.id}`, `${fileName}.opus`);
      return 'k ur clip is ready, use the `playclip` command to play it';
    } catch (e) {
      Memer.log(`[addclip] Failed to save clip!\n\t${e}`);
      return `Something went wrong while saving your hecking clip\n\`\`\`\n${e.message}\`\`\`\n\nJoin here (https://discord.gg/Wejhbd4) if the issue doesn't stop being an ass`;
    }
  },
  {
    triggers: ['addclip'],
    usage: '{command} <clipname>',
    description: 'Add a soundboard clip!',
    ownerOnly: true
  }
);
