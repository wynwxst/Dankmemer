const GenericCommand = require('../../models/GenericCommand');

function shuffle (array) {
  // From https://stackoverflow.com/a/2450976 because I'm lazy

  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const programmers = [
  ['Melmsie#0001', 'melmsie', 'dab dab dab'],
  ['Aetheryx#2222', 'Aetheryx', 'I like trains (retired)'],
  ['CyberRonin#5517', 'TheCyberRonin', 'Melmsie is my lover'],
  ['Kromatic#0420', 'Devoxin', 'Mayonnaise is an instrument'],
  ['perryprog#9657', 'perryprog', 'zoop best meme 2018'],
  ['Yukine#8080 ', 'Dev-Yukine', 'i need a good german meme'],
  ['ParadoxOrigins#5451', 'ParadoxOrigins', 'baguette'],
  ['Blake#0007', 'zBlakee', 'yahoo']
];

module.exports = new GenericCommand(
  () => ({
    title: 'Dank Memer Developers',
    description: shuffle(programmers).map(info => `[${info[0]}](https://github.com/${info[1]}) — ${info[2]}`).join('\n')
  }), {
    triggers: ['credits', 'helpers', 'devs', 'developers', 'programmers'],
    description: 'Thanks to all of you!',
    perms: ['embedLinks']
  }
);
