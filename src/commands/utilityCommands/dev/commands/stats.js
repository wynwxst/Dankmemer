module.exports = {
  help: 'stats',
  fn: async ({ Memer, msg }) => {
    const data = await Memer.db.getStats();
    data.total = [
      ` [00]`,
      `GUILDS: ${data.guilds}`,
      `SHARDS: ${data.clusters.map(c => c.shards).reduce((a, b) => a + b)}`,
      `RAM: ${(data.totalRam / 1000).toFixed(2)}GB`
    ];

    data.clusters = data.clusters.map(c => {
      return [
        `${c.cluster === Memer.clusterID ? '*' : ' '}[${(c.cluster).toString().padStart(2)}]`,
        `GUILDS:   ${c.guilds.toString().padStart(5)}`,
        `SHARDS:  ${c.shards}`,
        `RAM: ${c.ram.toFixed(2)}MB`,
        `UPTIME: ${Memer.parseTime(c.uptime / 1000)}`
      ].join(' | ');
    });

    data.clusters.push('\n');
    data.clusters.push(data.total.join(' | '));

    const pages = Memer.paginate(data.clusters.join('\n'), 1950);
    for (const page of pages) {
      await msg.channel.createMessage(`\`\`\`prolog\n${page}\n\`\`\``);
    }

    // return Memer.codeblock(data.clusters.join('\n'), 'prolog')
  }
};
