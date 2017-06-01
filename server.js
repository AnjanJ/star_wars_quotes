const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
app.set('view engine', 'ejs')

const mongoUrl = 'mongodb://anjan:rootanjan@ds151631.mlab.com:51631/star-wars-quotes'
var db
app.use(bodyParser.urlencoded({ extended: true }))

MongoClient.connect(mongoUrl, (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

// get root in ES5 JS version
// app.get('/', function(request, response) {
//     response.send('Hello World');
// })

// ES 6 with arrow function
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/views/index.html')
  var cursor = db.collection('quotes').find().toArray((err, results) => {
    if (err) return console.log(err)
        // render index.ejs
    res.render('index.ejs', {quotes: results})
  })
})

app.post('/quotes', (req, res) => {
  db.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})
