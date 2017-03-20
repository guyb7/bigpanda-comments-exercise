const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const CommentsFeed = require('./Models/CommentsFeed')

// Serve static files
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.redirect('/index.html')
})

// API endpoints
app.get('/api/feed', (req, res) => {
  setTimeout(() => {
    CommentsFeed.get((err, comments) => {
      res.json({
        comments: comments
      })
    })
  }, 800)
})

app.post('/api/add-comment', bodyParser.json(), (req, res) => {
  setTimeout(() => {
    CommentsFeed.add(req.body, (err) => {
      res.json({
        success: err === null
      })
    })
  }, 400)
})

app.listen(3000, () => {
  console.log('BigPanda comments is listening on port 3000')
})
