const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Serve static files
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.redirect('/index.html')
})

app.listen(3000, () => {
  console.log('BigPanda comments is listening on port 3000')
})
