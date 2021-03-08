const os = require('os')
const { GenericCommand } = require('../../models/')

const getCPUUsage = async () => {
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  let [timeUsed0, timeIdle0, timeUsed1, timeIdle1] = new Array(4).fill(0)

  const cpu0 = os.cpus()
  await sleep(1000)
  const cpu1 = os.cpus()

  for (const cpu of cpu1) {
    timeUsed1 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    )
    timeIdle1 += cpu.times.idle
  }
  for (const cpu of cpu0) {
    timeUsed0 += (
      cpu.times.user +
      cpu.times.nice +
      cpu.times.sys
    )
    timeIdle0 += cpu.times.idle
  }

  const totalUsed = timeUsed1 - timeUsed0
  const totalIdle = timeIdle1 - timeIdle0
  return (totalUsed / (totalUsed + totalIdle)) * 100
}

module.exports = new GenericCommand(
  async ({ Memer, msg }) => {
    const stats = await Memer.db.getStats()
    const CPUUsage = await getCPUUsage()
    const formatted =
    `[GUILDS] ${stats.guilds}\n` +
    `  [Large] ${stats.largeGuilds}\n` +
    `  [Exclusive] ${stats.exclusiveGuilds}\n` +
    `[USERS] ${stats.users}\n` +
    `  [Average] ${(stats.users / stats.guilds).toFixed()}\n` +
    `[MEMORY] ${(stats.totalRam / 1000).toFixed(1)}/${(os.totalmem() / 1073741824).toFixed()}gb (${(((stats.totalRam / 1000) / (os.totalmem() / 1073741824))).toFixed()}%)\n` +
    `  [System] ${((os.totalmem() - os.freemem()) / 1073741824).toFixed()}/${(os.totalmem() / 1073741824).toFixed(1)}gb (${(((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed()}%)\n` +
    `[UPTIME] ${Memer.parseTime(process.uptime())}\n` +
    `  [System] ${Memer.parseTime(os.uptime())}\n` +
    `[CPU] ${CPUUsage.toFixed(1)}%\n`

    return '```ini\n' + formatted + '\n```'
  }, {
    triggers: ['debug'],
    description: 'Returns information and statistics about Dank Memer.',
    perms: ['embedLinks']
  }
)
