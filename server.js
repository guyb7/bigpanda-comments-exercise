const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Serve static files
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.redirect('/index.html')
})

// API endpoints
app.get('/api/feed', (req, res) => {
  setTimeout(() => {
    res.json({
      comments: [
        {
          id: 'a1b2c3',
          email: 'elik@bigpanda.io',
          message: 'Hello there'
        }, {
          id: 'a1b2d4',
          email: 'Shai@bigpanda.io',
          message: 'Good!'
        }
      ]
    })
  }, 800)
})

app.post('/api/add-comment', bodyParser.json(), (req, res) => {
  setTimeout(() => {
    console.log(req.body);
    res.json({ success: true })
  }, 400)
})

app.listen(3000, () => {
  console.log('BigPanda comments is listening on port 3000')
})
