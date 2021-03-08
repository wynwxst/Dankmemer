const os = require('os');
const GenericCommand = require('../../models/GenericCommand');
// const { promisify } = require('util')
// const exec = promisify(require('child_process').exec)
const getCPUUsage = async () => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  let [timeUsed0, timeIdle0, timeUsed1, timeIdle1] = new Array(4).fill(0);

  const cpu0 = os.cpus();
  await sleep(1000);
  const cpu1 = os.cpus();

  for (const cpu of cpu1) {
    timeUsed1 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    );
    timeIdle1 += cpu.times.idle;
  }
  for (const cpu of cpu0) {
    timeUsed0 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    );
    timeIdle0 += cpu.times.idle;
  }

  const totalUsed = timeUsed1 - timeUsed0;
  const totalIdle = timeIdle1 - timeIdle0;
  return (totalUsed / (totalUsed + totalIdle)) * 100;
};

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    // const sfxCount = await exec('$(find /home/memer/Dank-Memer/src/assets/audio/custom/ -type f | wc -l)').catch(() => 0)
    // const sfxSize = await exec('$(du -sh /home/memer/Dank-Memer/src/assets/audio/custom/ | cut -f1)').catch(() => 0)
    const stats = await Memer.db.getStats();
    let users = await Memer.r.table('users').count();
    let guilds = await Memer.r.table('guilds').count();
    let cd = await Memer.r.table('cooldowns').count();
    let tags = await Memer.r.table('tags').count();
    let updates = await Memer.r.table('updates').count();
    let donors = await Memer.r.table('donors').count();
    const CPUUsage = await getCPUUsage();
    let cached = await Memer.redis.keys('msg-*');
    cached = cached.length;

    const formatted =
    `[GUILDS] ${stats.guilds}\n` +
    `  [Joined] ${Memer.stats.guildsJoined}\n` +
    `  [Left] ${Memer.stats.guildsLeft}\n` +
    `  [Large] ${stats.largeGuilds}\n` +
    `  [Exclusive] ${stats.exclusiveGuilds}\n` +
    `[USERS] ${stats.users}\n` +
    `  [Average] ${(stats.users / stats.guilds).toFixed()}\n` +
    `[MESSAGES] ${Memer.stats.messages}\n` +
    `  [Cached] ${cached}\n` +
    `[COMMANDS RAN] ${Memer.stats.commands}\n` +
    `  [Average] ${(Memer.stats.commands / stats.guilds).toFixed(4)}\n` +
    `[MEMORY] ${(stats.totalRam / 1000).toFixed(1)}/${(os.totalmem() / 1073741824).toFixed(1)}gb (${((stats.totalRam / 1000) / (os.totalmem() / 1073741824)).toFixed(1)}%)\n` +
    `  [System] ${((os.totalmem() - os.freemem()) / 1073741824).toFixed(1)}/${(os.totalmem() / 1073741824).toFixed(1)}gb (${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1)}%)\n` +
    `  [Cluster] ${(stats.totalRam / 1000).toFixed(1) / Memer.config.sharder.clusters}gb\n` +
    `[UPTIME] ${Memer.parseTime(process.uptime())}\n` +
    `  [System] ${Memer.parseTime(os.uptime())}\n` +
    `[CPU] ${CPUUsage.toFixed(1)}%\n` +
    `[ERRORS] ${Memer.stats.errReported}\n` +
    `  [Eris] ${Memer.stats.err}\n` +
    `[RETHINK]` +
    `  [Guilds] ${guilds}\n` +
    `  [Users] ${users}\n` +
    `  [Donors] ${donors}\n` +
    `  [Cooldowns] ${cd}\n` +
    `  [Tags] ${tags}\n` +
    `  [Update Channels] ${updates}\n`;
    return '```ini\n' + formatted + '\n```';
  }, {
    triggers: ['debug'],
    cooldown: 1e4,
    ownerOnly: true,
    description: 'Returns information and statistics about Dank Memer.',
    perms: ['embedLinks']
  }
);
