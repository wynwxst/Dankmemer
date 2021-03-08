const { GenericCommand } = require('../../models/')
const videos = [
  'https://www.pornhub.com/view_video.php?viewkey=ph5a5a31a130d7b',
  'https://www.pornhub.com/view_video.php?viewkey=ph5925ca42189b1',
  'https://www.pornhub.com/view_video.php?viewkey=ph58a2743e7bc0a',
  'https://www.pornhub.com/view_video.php?viewkey=ph588bb994715f4',
  'https://www.pornhub.com/view_video.php?viewkey=ph57a9e5cbbbc6b',
  'https://www.pornhub.com/view_video.php?viewkey=ph594f81e1bb436',
  'https://www.pornhub.com/view_video.php?viewkey=ph57f425354c95a',
  'https://www.pornhub.com/view_video.php?viewkey=ph57cb90be0d19d',
  'https://www.pornhub.com/view_video.php?viewkey=ph575460edacb01',
  'https://www.pornhub.com/view_video.php?viewkey=ph588c05619d874',
  'https://www.pornhub.com/view_video.php?viewkey=ph586f01bb87f0f'
]

module.exports = new GenericCommand(
  async ({ Memer }) => {
    return {
      title: 'Minecraft Porn',
      description: `You must [click here](${Memer.randomInArray(videos)}) to watch this weird shit.`,
      footer: { text: 'Why does this exist' }
    }
  },
  {
    triggers: ['mcporn'],
    isNSFW: true,
    description: 'This is some good stuff, trust me'
  }
)
