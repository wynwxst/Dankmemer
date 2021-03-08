const { promisify } = require('util')
const redis = require('redis')

module.exports = (hostAddr) => new Promise(resolve => {
  const client = redis.createClient({ host: hostAddr || '127.0.0.1' })

  for (const prop in client) {
    if (typeof client[prop] === 'function') {
      client[`${prop}Async`] = promisify(client[prop]).bind(client)
    }
  }

  client.on('error', (err) => {
    console.error(err)
  })

  client.on('ready', resolve.bind(null, client))
})
