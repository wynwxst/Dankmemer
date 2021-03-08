module.exports = {
  help: 'emoji',
  fn: async ({ Memer }) => {
    let data = await getEmoji(Memer);
    return {
      title: `Here is your random emoji`,
      // description: `⚠ **Disclaimer** ⚠\nThis emoji is from a random server.\nIf it is breaking [Discord TOS](https://discordapp.com/terms) please report it to \`abuse@discordapp.com\` with this info:\nServer ID: ${data.server}\nEmoji ID: ${data.emoji}`,
      image: { url: `https://cdn.discordapp.com/emojis/${data.emoji}.${data.animated ? 'gif' : 'png'}` }
    };
  }
};

async function getEmoji (Memer) {
  let guild = Memer.bot.guilds.random();
  if (guild.emojis.length < 1) {
    return getEmoji(Memer);
  }
  let chosen = Memer.randomInArray(guild.emojis);
  return {
    server: guild.id,
    emoji: chosen.id,
    animated: chosen.animated
  };
}
