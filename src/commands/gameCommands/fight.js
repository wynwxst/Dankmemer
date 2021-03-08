const GenericCommand = require('../../models/GenericCommand');
module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    let author = msg.author;
    let enemy = msg.args.resolveUser();
    if (!enemy) {
      return 'you need to provide a valid user ID or name to fight against lol';
    }
    if (enemy.id === author.id) {
      return 'You can\'t fight urself dumbo';
    }
    if (enemy.bot) {
      return 'You can\'t fight against bots, you\'ll never hear back from them u dummy';
    }
    enemy.health = author.health = 100;
    enemy.armor = author.armor = 0;
    let turn = author;
    let oppturn = enemy;

    // Randomly select starting user
    if (Math.random() >= 0.50) {
      oppturn = [turn, turn = oppturn][0];
    }

    const performTurn = async (attacker, opponent, retry) => {
      msg.channel.createMessage(`${turn.mention}, what do you want to do? \`punch\`, \`defend\` or \`end\`?\nType your choice out in chat as it's displayed!`);
      let prompt = await Memer.MessageCollector.awaitMessage(msg.channel.id, attacker.id, 30e3);
      if (!prompt) {
        msg.channel.createMessage(`${attacker.username} didn't answer in time, what a noob. ${opponent} wins`);
      } else if (prompt.content.toLowerCase() === 'punch') {
        let critChance = Math.random() >= 0.75; // 25% chance
        let damage = Memer.randomNumber(1, (critChance ? 85 : 65));

        opponent.health -= (damage - opponent.armor) < 0 ? 5 : (damage - opponent.armor);
        return damage;
      } else if (prompt.content.toLowerCase() === 'defend') {
        let critChance = Math.random() >= 0.75; // 25% chance
        let defense = Memer.randomNumber(5, (critChance ? 40 : 20));

        if (attacker.armor < 50) {
          attacker.armor += defense;
          msg.channel.createMessage(`**${attacker.username}** increased their protec level by **${defense}**! THEY PROTEC`);
        } else {
          msg.channel.createMessage('don\'t be greedy ur already at the max armor level');
        }
        return false;
      } else if (prompt.content.toLowerCase() === 'end') {
        msg.channel.createMessage(`**${attacker.username}** has ended the game what a wimp`);
      } else {
        msg.channel.createMessage(`**${attacker.username}**, that's not a valid option lmao! You must type \`punch\`, \`defend\` or \`end\` in chat!\n${retry ? 'The game has ended due to multiple invalid choices, god ur dumb' : ''}`);
        if (!retry) {
          return performTurn(attacker, opponent, true);
        }
      }
    };

    const play = async () => {
      const damage = await performTurn(turn, oppturn);
      if (damage === undefined) {
        return;
      }
      if (!damage) {
        oppturn = [turn, turn = oppturn][0];
        return play();
      }
      const adjective = Memer.randomInArray(['an incredible', 'a dank', 'a l33t', 'a game-ending', 'an amazing', 'a dangerous', 'a painful', 'a CrAzY']);
      msg.channel.createMessage(`**${turn.username}** lands ${adjective} hit on **${oppturn.username}** dealing **${damage}**!\n**${oppturn.username}** is left with ${oppturn.health < 0 ? 0 : oppturn.health} health!`);
      if (turn.health > 0 && oppturn.health > 0) {
        oppturn = [turn, turn = oppturn][0];
        return play();
      } else {
        const loser = turn.health > 1 ? oppturn : turn;
        const winner = loser === turn ? oppturn : turn;
        loser.health = 0;

        // Random words to SPICE up the winning message
        const wowword = Memer.randomInArray(['Holy heck!', 'Wow!', 'I did not expect that!', 'Like it or hate it,', 'YES!', 'This is so sad!', 'very good', 'Dang!']);
        const noun = Memer.randomInArray(['just', 'totally', 'heckin', '100%', 'absolutely', 'fricken', 'legitimately', 'completely']);
        const verb = Memer.randomInArray(['rekt', 'beaned', 'memed', 'destroyed', 'hecked', 'ruined', 'bamboozled', 'roasted']);
        msg.channel.createMessage(`${wowword} **${winner.username}** ${noun} ${verb} **${loser.username}**, winning with just \`${winner.health} HP\` left!`);
      }
    };
    play();
  },
  {
    triggers: ['fight', 'challenge'],
    usage: '{command} [user]',
    description: 'Fight to the death!'
  }
);
