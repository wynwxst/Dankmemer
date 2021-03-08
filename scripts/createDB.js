const r = require('rethinkdbdash')();
const tables = [
  'automeme',
  'blocked',
  'cooldowns',
  'donors',
  'guildUsage',
  'guilds',
  'stats',
  'tags',
  'updates',
  'users',
  'autonsfw'
];
const secondary = [{
  table: 'guildUsage',
  index: 'pls'
}, {
  table: 'tags',
  index: 'guild_id'
}, {
  table: 'donors',
  index: 'patreonID'
}, {
  table: 'users',
  indexes: ['bank', 'donor', 'pls', 'pocket', 'spam']
}];
const startTime = Date.now();
(async function () {
  await Promise.all([tables.map(t => r.tableCreate(t).run().catch(err => console.log(`Failed to create table ${t}: ${err}`)))]);
  console.log(`${tables.join(', ')} tables created, waiting for them to be ready`);
  await sleep(10 * 1000);
  for (const secondaryIndex of secondary) {
    if (secondaryIndex.index) {
      await r.table(secondaryIndex.table).indexCreate(secondaryIndex.index).run().catch(handleIndexFailure.bind(this, secondaryIndex));
      console.log(`${secondaryIndex.index} index created`);
    } else {
      await Promise.all(secondaryIndex.indexes.map(i => r.table(secondaryIndex.table).indexCreate(i).run().catch(handleIndexFailure.bind(this, secondaryIndex))));
      console.log(`${secondaryIndex.indexes.join(', ')} indexes created`);
    }
  }
  console.log(`Setup done: ${Date.now() - startTime}ms`);
  r.getPoolMaster().drain();
})();

async function sleep (ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function handleIndexFailure (index, err) {
  console.log(`Failed to create secondary index ${index}: ${err}`);
}
