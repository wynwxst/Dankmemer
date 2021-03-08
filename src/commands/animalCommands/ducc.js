const { GenericMediaCommand } = require('../../models/');

module.exports = new GenericMediaCommand({
  triggers: ['ducc', 'quacker', 'quack', 'duck', 'kwek', 'eend'],
  description: 'Quack quack!',

  title: 'Quack quack! 🦆',
  message: 'Image from random-d.uk',
  JSONKey: 'url',
  reqURL: 'https://api.random-d.uk/random'
});
