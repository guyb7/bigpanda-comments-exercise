// Redis setup
const redis_set_name = 'bigpanda-exercise-guyb7-comments'

const redis = require('redis')
const redisClient = redis.createClient()
redisClient.on('error', (err) => {
  console.log(`DB Error: ${err}`)
})

module.exports = {
  get(cb) {
    redisClient.ZRANGE(redis_set_name, 0, Date.now(), (err, replies) => {
      cb(err, replies.map(reply => {
        return JSON.parse(reply)
      }))
    })
  },

  add(comment, cb) {
    redisClient.ZADD(redis_set_name, Date.now(), JSON.stringify(comment), (err) => {
      cb(err)
    })
  },

  clear(cb) {
    redisClient.DEL(redis_set_name, (err) => {
      cb(err)
    })
  }
}
