/**
 *  Dank Memer: A discord memebot, made to spread dreams of memes, and memes of dreams
 *  Copyright (C) 2018 Dank Memer Team (dankmemerbot@gmail.com)
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as published
 *  by the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const config = require('./config.json');
const secrets = require('./secrets.json');
const { Master: Sharder } = require('eris-sharder');
const { post } = require('./utils/http');
const r = require('rethinkdbdash')();

// Initiate Eris-Sharder

const master = new Sharder(secrets.bot.token, config.sharder.path, {
  stats: true,
  name: config.sharder.name || 'Dank Memer',
  webhooks: config.sharder.webhooks,
  clientOptions: config.eris.clientOptions,
  shards: config.sharder.shardCount || 1,
  statsInterval: config.statsInterval || 1e4,
  clusters: config.sharder.clusters || undefined
});

// Record bot stats every x seconds/minutes to the database

master.on('stats', res => {
  r.table('stats')
    .insert({ id: 1, stats: res }, { conflict: 'update' })
    .run();

  // TODO: Post stats to endpoint on the webserver
});

// Delete stats data on SIGINT to help prevent problems with some commands

process.on('SIGINT', async () => { // TODO: See if this still needs to happen after disabling automatic db wipes on pls lb/rich/ulb
  await r.table('stats')
    .get(1)
    .delete()
    .run();

  process.exit();
});

// Post guild count to each bot list api

if (require('cluster').isMaster && !config.options.dev) {
  setInterval(async () => {
    const { stats: { guilds } } = await r.table('stats')
      .get(1)
      .run();

    for (const botlist of secrets.botlists) {
      post(botlist.url)
        .set('Authorization', botlist.token)
        .send({
          [`server${botlist.url.includes('carbonitex') ? '' : '_'}count`]: guilds, // TODO: Does carbon still not allow underscore?
          key: botlist.token
        })
        .end();
    }
  }, 60 * 60 * 1000);
}

(async () => {
  const redis = await require('./utils/redisClient.js')(config.redis);
  const changesStream = await r.table('users').changes({ squash: true, includeInitial: false, includeTypes: true }).run();
  changesStream.on('data', data => {
    const pipeline = redis.pipeline();
    if (data.type === 'remove') {
      pipeline.zrem('pocket-leaderboard', data.old_val.id);
      pipeline.zrem('pls-leaderboard', data.old_val.id);
      pipeline.exec()
        .catch(console.error);
    } else {
      pipeline.zadd('pocket-leaderboard', data.new_val.pocket, data.new_val.id);
      pipeline.zadd('pls-leaderboard', data.new_val.pls, data.new_val.id);
      pipeline.exec()
        .catch(console.error);
    }
  });
})();
