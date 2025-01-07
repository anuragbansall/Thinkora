const express = require('express')
const app = express()
const path = require('path')
const { v4: uuidv4 } = require('uuid');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))

// Todo: Will add Database later, for now we will use static data
const posts = [
    {
        id: uuidv4(),
        username: "anuragbansall",
        title: "Welcome to My Blog",
        content: "This is my first blog post!",
        date: new Date().toLocaleDateString()
    },
    {
        id: uuidv4(),
        username: "sarahjones",
        title: "My Second Blog Post",
        content: "I've been trying to learn more about programming!",
        date: new Date().toLocaleDateString()
    },
]

app.get('/posts', (req, res) => {
    res.render("index.ejs", {posts})
})

app.get('/posts/new', (req, res) => {
    res.render("new.ejs")
})

app.get('/posts/:id', (req, res) => {
    const { id } = req.params
    const post = posts.find(p => p.id === id);
    res.render("show.ejs", { post })
})

app.post('/posts', (req, res) => {
    const { username, title, content } = req.body
    posts.push({ username, title, content, id: uuidv4(), date: new Date().toLocaleDateString() })
    res.redirect('/posts')
})


const port = 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})