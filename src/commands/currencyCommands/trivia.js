const { GenericCommand } = require('../../models/')

module.exports = new GenericCommand(
  async ({ Memer, msg, addCD }) => {
    let data = await Memer.http.get('https://opentdb.com/api.php')
      .query({ amount: 1, type: 'multiple', encode: 'url3986' })
    let trivia = data.body.results[0]

    let answers = trivia.incorrect_answers
    answers.push(trivia.correct_answer)
    answers = answers.map(m => { return decodeURIComponent(m) })
    answers.sort(function (a, b) { // sort the answers in abc order to prevent the correct answer from being in the same spot each time
      let answerA = a.toLowerCase()
      let answerB = b.toLowerCase()
      if (answerA < answerB) { return -1 }
      if (answerA > answerB) { return 1 }
      return 0
    })
    let front = answers.map(m => `${answers.indexOf(m) + 1}) *${m}*`).join('\n')

    let time
    let worth

    switch (trivia.difficulty) {
      case 'easy':
        time = 18 * 1000
        worth = 1
        break
      case 'medium':
        time = 15 * 1000
        worth = 2
        break
      case 'hard':
        time = 15 * 1000
        worth = 3
        break
    }

    msg.channel.createMessage({ embed: {
      title: `${msg.author.username}'s trivia question.`,
      color: Memer.randomColor(),
      description: `**${decodeURIComponent(trivia.question)}**\n*Please choose an answer within ${time / 1000}s*\n\n` + front,
      fields: [
        // { name: 'Choices', value: answers.join('\n'), inline: false },
        { name: 'Worth', value: `\`${worth} ${worth === 1 ? 'coin' : 'coins'}\``, inline: true },
        { name: 'Difficulty', value: `\`${decodeURIComponent(trivia.difficulty)}\``, inline: true },
        { name: 'Category', value: `\`${decodeURIComponent(trivia.category)}\``, inline: true }
      ],
      footer: { text: 'You can use the number or the word to answer!' }
    }})

    const choice = await Memer.MessageCollector.awaitMessage(msg.channel.id, msg.author.id, time)

    if (!choice) {
      return 'You did not answer in time, what the heck dude/lady (I do not judge or assume ok)'
    } else if (choice.content.toLowerCase().includes(decodeURIComponent(trivia.correct_answer).toLowerCase())) {
      await Memer.db.addPocket(msg.author.id, worth)
      await addCD()
      return `correct, have ${worth} coins`
    } else if (Number(choice.content) === answers.indexOf(decodeURIComponent(trivia.correct_answer)) + 1) {
      await Memer.db.addPocket(msg.author.id, worth)
      await addCD()
      return `correct, have ${worth} coins`
    } else {
      await addCD()
      return `no, the correct answer was \`${decodeURIComponent(trivia.correct_answer)}\``
    }
  },
  {
    triggers: ['trivia'],
    cooldown: 18e4,
    donorCD: 12e4,
    description: 'Answer some trivia for a chance to win some coins.'
  }
)
