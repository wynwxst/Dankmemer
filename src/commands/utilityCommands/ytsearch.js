const { GenericCommand } = require('../../models/')
const search = require('tubesearch')

module.exports = new GenericCommand(
  async ({ Memer, msg, args }) => {
    let results = await search(args.join(' '))
    let more
    if (results.length < 1) {
      return 'nothing found for that'
    }
    if (results.length > 5) {
      more = results.length - 5
      results.length = 5
    } else {
      more = false
    }
    return {
      title: 'Search Results...',
      description: `${results.map(r => `\`${r.duration}\`[${r.title}](${r.link}) - ${r.uploader}`).join('\n')}\n *${more ? `and ${more} more...` : 'thanks youtube'}*`
    }
  }, {
    triggers: ['ytsearch', 'youtubesearch'],
    usage: '{command} <thing to search for>',
    missingArgs: 'Give me something to search for, idiot',
    description: 'Search for a video on youtube'
  }
)
