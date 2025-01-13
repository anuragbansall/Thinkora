const express = require('express')
const app = express()
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override')
const mysql = require('mysql2')
require('dotenv').config();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(methodOverride('_method'))

// Connect to MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.get("/", (req, res) => {
    res.redirect('/posts')
})

// Posts Route
app.get('/posts', (req, res) => {
    const q = "select * from posts"
    connection.query(q, (err, results) => {
        const posts = results
        res.render("index.ejs", {posts})
    })

})

// New Post Route
app.get('/posts/new', (req, res) => {
    res.render("new.ejs", { post: null })
})

// Edit Post Route
app.get('/posts/:id/edit', (req, res) => {
    const { id } = req.params;
    const q = "select * from posts where id = ?"
    connection.query(q, [id], (err, results) => {
        const post = results[0]
        res.render('new.ejs', { post });
    })
});

// Show Post Route
app.get('/posts/:id', (req, res) => {
    const { id } = req.params
    const q = "select * from posts where id = ?"
    connection.query(q, [id], (err, results) => {
        const post = results[0]
        res.render("show.ejs", { post })
    })
})

// New Post Endpoint
app.post('/posts', (req, res) => {
    const { username, title, content } = req.body
    const id = uuidv4()
    const date = new Date().toISOString().split('T')[0]; // Formats as YYYY-MM-DD
    const q = "insert into posts (id, username, title, content, date) values (?, ?, ?, ?, ?)"
    connection.query(q, [id, username, title, content, date], (err, results) => {
        if (err) throw err;
        res.redirect('/posts')
    })
})

// Update Post Endpoint
app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const {username, title, content} = req.body;
    const q = "update posts set username =?, title =?, content =? where id =?"
    connection.query(q, [username, title, content, id], (err, results) => {
        if (err) throw err;
        res.redirect(`/posts/${id}`)
    })
})

// Delete Post Endpoint
app.delete("/posts/:id", (req, res) => {
    const {id} = req.params
    const q = "delete from posts where id = ?"
    connection.query(q, [id], (err, results) => {
        if (err) throw err;
        res.redirect("/posts")
    })
})

const port = 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})