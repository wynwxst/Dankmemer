const GenericCommand = require('../../models/GenericCommand');

module.exports = new GenericCommand(
  async ({ Memer, msg, args, addCD }) => {
    let content = msg.args.gather();
    if (msg.attachments.length) {
      if (!msg.attachments[0].width) {
        return 'this isn\'t an image dumbo';
      }
      content = msg.attachments[0].url;
    }
    if (!msg.attachments.length && !content) {
      return 'You need to provide a name (text) or an image (either by attachment or URL)';
    }

    await addCD();
    // If an image is provided
    if (/^(https?):\/\/[^\s/$.?#].[^\s]*$/i.test(content)) {
      let req = await Memer.http.get(`https://watson-api-explorer.ng.bluemix.net/visual-recognition/api/v3/detect_faces?url=${encodeURIComponent(content)}&version=2016-05-20`);
      if (!req.body.images) {
        return 'I couldn\'t find a face in that image';
      }
      let image = req.body.images[0];
      if (!image.faces[0]) {
        return 'Woops, couldn\'t guess anything';
      }
      return `I think that this face belongs to a **${image.faces[0].gender.gender.toLowerCase()}** who is **${image.faces[0].age.min} to ${image.faces[0].age.max}** years old`;
    } else {
      let req = await Memer.http.get(`https://api.genderize.io/?name=${encodeURIComponent(content)}`);
      if (!req.body.gender) {
        return 'Ok i couldn\'t guess a gender, that\'s probably not even a real name smh';
      }
      const probability = req.body.probability * 100;
      return `I am ${probability % 1 !== 0 ? probability.toFixed(2) : probability}% sure that the name **${content}** belongs to a ${req.body.gender}`;
    }
  }, {
    triggers: ['genderguess', 'genderg'],
    usage: '{command} [name or image]',
    cooldown: 5e3,
    donorCD: 2e3,
    description: 'Guesses gender based on name or an image when provided'
  }
);
