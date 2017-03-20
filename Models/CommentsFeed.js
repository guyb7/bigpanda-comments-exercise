// Redis setup
const redis_set_name = 'bigpanda-exercise-guyb7-comments'

const redis = require('redis')
const redisClient = redis.createClient()
redisClient.on('error', (err) => {
  console.log(`DB Error: ${err}`)
})

module.exports = {
  get(cb) {
    redisClient.SMEMBERS (redis_set_name, (err, replies) => {
      cb(err, replies.map(reply => {
        return JSON.parse(reply)
      }))
    })
  },

  add(comment, cb) {
    redisClient.SADD(redis_set_name, JSON.stringify(comment), (err) => {
      cb(err)
    })
  }
}
