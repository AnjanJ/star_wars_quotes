const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express()
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.json())

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
        res.render('index.ejs', { quotes: results })
    })
})

app.post('/quotes', (req, res) => {
    db.collection('quotes').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('saved to database')
        res.redirect('/')
    })
})

app.put('/quotes', (req, res) => {
    //Handling put request here
    db.collection('quotes')
        .findOneAndUpdate({ name: 'Yoda' }, {
            $set: {
                name: req.body.name,
                quote: req.body.quote
            }
        }, {
            sort: { _id: -1 },
            upsert: true
        }, (err, result) => {
            if (err, result) return res.send(err)
            res.send(result)
        })
})

app.delete('/quotes', (req, res) => {
    //handle delete event
    db.collection('quotes').findOneAndUpdate({ name: req.body.name },
        (err, result) => {
            if (err) return res.send(500, err)
            res.send('A darth vadar quote got deleted')
        })
})