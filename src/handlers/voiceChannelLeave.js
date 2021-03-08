exports.handle = async function (member, oldChannel) {
  if (member) {
    const music = this.musicManager.get(member.guild.id);
    if (music.sfxautoplay.enabled && music.sfxautoplay.host === member) {
      await music.endSession();
    }
  }
};
