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

const config = require('./config.json')
const { Master: Sharder } = require('eris-sharder')
const { post } = require('./utils/http')
const r = require('rethinkdbdash')()
const StatsD = require('node-dogstatsd').StatsD
let s = new StatsD()

const master = new Sharder(config.token, '/mainClass.js', {
  stats: true,
  name: 'Maymays',
  webhooks: config.webhooks,
  clientOptions: {
    disableEvents: {
      CHANNEL_PINS_UPDATE: true,
      USER_SETTINGS_UPDATE: true,
      USER_NOTE_UPDATE: true,
      RELATIONSHIP_ADD: true,
      RELATIONSHIP_REMOVE: true,
      GUILD_BAN_ADD: true,
      GUILD_BAN_REMOVE: true,
      TYPING_START: true,
      MESSAGE_DELETE_BULK: true,
      MESSAGE_UPDATE: true
    },
    disableEveryone: true,
    messageLimit: 1,
    requestTimeout: 3e4
  },
  shards: config.shardCount || 1,
  statsInterval: 1e4,
  clusters: config.clusters || undefined
})

master.on('stats', res => {
  s.gauge('bot.guilds', res.guilds)
  s.gauge('bot.users', res.users)
  s.gauge('bot.voice', res.voice)
  s.gauge('bot.mem', res.mem)
  r.table('stats')
    .insert({ id: 1, stats: res }, { conflict: 'update' })
    .run()
})

process.on('SIGINT', async () => {
  await r.table('stats')
    .get(1)
    .delete()
    .run()

  process.exit()
})

if (require('cluster').isMaster && !config.dev) {
  setInterval(async () => {
    const { stats: { guilds } } = await r.table('stats')
      .get(1)
      .run()

    for (const botlist of config.botlists) {
      post(botlist.url)
        .set('Authorization', botlist.token)
        .send({
          [`server${botlist.url.includes('carbonitex') ? '' : '_'}count`]: guilds,
          key: botlist.token
        })
        .end()
    }
  }, 5 * 60 * 1000)
}
