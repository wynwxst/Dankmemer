module.exports = class Autopost {
  constructor (client) {
    /** @type {import("../models/GenericCommand").Memer} The memer instance */
    this.client = client;
  }

  /** @type {Promise<String>} Memer's avatar */
  get avatar () {
    return this.client.http.get(this.client.bot.user.dynamicAvatarURL())
      .then(res => {
        return `data:${res.headers['content-type']};base64,${res.body.toString('base64')}`;
      });
  }

  async getRedditPost () {
    let subs = [
      'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/dank_meme/top/.json?sort=top&t=day&limit=40',
      'https://www.reddit.com/r/memes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/meirl/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/2meirl4meirl/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/PrequelMemes/top/.json?sort=top&t=day&limit=100',
      'https://www.reddit.com/r/surrealmemes/top/.json?sort=top&t=week&limit=100',
      'https://www.reddit.com/r/DeepFriedMemes/top/.json?sort=top&t=day&limit=100'
    ];

    let sub = this.client.randomInArray(subs);
    let limit = sub.split('limit=')[1];
    const res = await this.client.http.get(sub);
    const posts = res.body.data.children.filter(post => post.data.post_hint === 'image');
    return posts[Math.floor(Math.random() * Number(limit) - 1)];
  }

  async automeme () {
    const post = await this.getRedditPost();
    let check = await this.client.db.allAutomemeChannels();
    if (!post) {
      return this.automeme();
    }
    for (const { id, interval, webhookID, webhookToken } of check) {
      if (webhookID) {
        let autopostInterval = await this.client.redis.get(`automeme-${id}`)
          .then(res => res ? JSON.parse(res) : undefined);
        if (!autopostInterval) {
          await this.client.redis.set(`automeme-${id}`, JSON.stringify({ guildID: id, interval: interval || 5, elapsed: 0 }));
          autopostInterval = await this.client.redis.get(`automeme-${id}`)
            .then(res => res ? JSON.parse(res) : undefined);
        }
        await this.client.redis.set(`automeme-${id}`, JSON.stringify({ guildID: id, interval: interval || 5, elapsed: Number(autopostInterval.elapsed += 5) }));
        if (autopostInterval.elapsed < autopostInterval.interval) {
          continue;
        } else {
          await this.client.redis.set(`automeme-${id}`, JSON.stringify({ guildID: id, interval: interval || 5, elapsed: 0 }));
        }

        this.client.bot.executeWebhook(webhookID, webhookToken, {
          embeds: [ {
            title: post.data.title,
            url: `https://www.reddit.com${post.data.permalink}`,
            description: post.data.selftext,
            image: { url: post.data.url },
            footer: { text: `👍 ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}` }
          } ],
          wait: true
        })
          .catch((err) => {
            if ([10003, 10015, 50001, 50013].includes(err.code)) {
            // Remove this channel from the database if the channel doesn't exist, the webhook doesn't exist, or the bot miss the permissions to access it
              this.client.db.removeAutomemeChannel(id);
            }
          });
      }
    }
  }

  async autonsfw () {
    let check = await this.client.db.allAutonsfwChannels();
    for (const { type, id, interval, webhookID, webhookToken } of check) {
      if (webhookID) {
        let autopostInterval = await this.client.redis.get(`autonsfw-${id}`)
          .then(res => res ? JSON.parse(res) : undefined);
        if (!autopostInterval) {
          await this.client.redis.set(`autonsfw-${id}`, JSON.stringify({ guildID: id, interval: interval || 5, elapsed: 0 }));
          autopostInterval = await this.client.redis.get(`autonsfw-${id}`)
            .then(res => res ? JSON.parse(res) : undefined);
        }
        await this.client.redis.set(`autonsfw-${id}`, JSON.stringify({ guildID: id, interval: interval || 5, elapsed: Number(autopostInterval.elapsed += 5) }));
        if (autopostInterval.elapsed < autopostInterval.interval) {
          continue;
        } else {
          await this.client.redis.set(`autonsfw-${id}`, JSON.stringify({ guildID: id, interval: interval || 5, elapsed: 0 }));
        }

        const data = await this.client.http.get(`https://boob.bot/api/v2/img/${type}`, {
          headers: {
            Authorization: this.client.secrets.extServices.boobbot,
            Key: this.client.secrets.extServices.boobbot
          }
        })
          .then(res => res.body.url);

        this.client.bot.executeWebhook(webhookID, webhookToken, {
          embeds: [ {
            title: type.charAt(0).toUpperCase() + type.slice(1),
            image: { url: data },
            footer: { text: 'Free nudes thanks to boobbot & tom <3' }
          } ],
          wait: true
        })
          .catch((err) => {
            if ([10003, 10015, 50001, 50013].includes(err.code)) {
            // Remove this channel from the database if the channel doesn't exist, the webhook doesn't exist, or the bot miss the permissions to access it
              this.client.db.removeAutonsfwChannel(id);
            }
          })
          .then(async (message) => {
            // Check if the channel in which the message was sent is NSFW, and if not, removes the channel from the db and try to delete the message
            let grabbedChannel = await this._fetchChannel(message.channel_id);
            if (!grabbedChannel) {
              grabbedChannel = await this.client.bot.getRESTChannel(message.channel_id)
                .catch(err => err.code);
              if ([50001, 50013].includes(grabbedChannel)) {
                this.client.db.removeAutonsfwChannel(id);
              }
            }
            if (typeof grabbedChannel !== 'number' && !grabbedChannel.nsfw) {
              this.client.db.removeAutonsfwChannel(id);
              this.client.bot.deleteMessage(message.channel_id, message.id).catch(() => {});
            }
          });
      }
    }
  }

  async _fetchChannel (id) { // Because eris-sharder sucks hard
    return new Promise(resolve => {
      setTimeout(() => resolve({ id }), 2000);
      this.client.ipc.fetchChannel(id)
        .then(resolve);
    });
  }

  async post () {
    await this.automeme();
    await this.autonsfw();
  }
};
