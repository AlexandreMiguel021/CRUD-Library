const express = require('express')
const exphbs = require('express-handlebars')
const pool = require('./db/conn')
const app = express()

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(express.json())

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.get('/', (req, res) => res.render('home'))

// insert
app.post('/books/insertbook', (req, res) => {
  const insert = `INSERT INTO books (??, ??) values (?, ?)`
  const data = ['title', 'pageqty', req.body.title, req.body.pageqty]
  pool.query(insert, data, err => (err ? console.log(err) : res.redirect('/')))
})

//select
app.get('/books', (req, res) => {
  const select = 'SELECT * FROM books'
  pool.query(select, (err, data) => {
    if (err) {
      return console.log(err)
    }
    res.render('./books', { data })
  })
})

app.get('/books/edit/:id', (req, res) => {
  const sql = `SELECT * FROM books WHERE ?? = ?`
  const data = ['id', req.params.id]
  pool.query(sql, data, (err, data) => {
    if (err) {
      return console.log(err)
    }
    const book = data[0]
    res.render('editbook', { book })
  })
})

//update
app.post('/books/updatebook', (req, res) => {
  const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`
  const data = ['title', req.body.title, 'pageqty', req.body.pageqty, 'id', req.body.id]
  pool.query(sql, data, err => (err ? console.log(err) : res.redirect('/books')))
})

// delete
app.post('/books/remove/:id', (req, res) => {
  const id = req.params.id
  const sqlDelete = `DELETE FROM books WHERE ?? = ?`
  const data = ['id', id]
  pool.query(sqlDelete, data, err => (err ? console.log(err) : res.redirect('/books')))
})

app.listen(3000)
