const express = require('express')
const app = express()
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))

// Todo: Will add Database later, for now we will use static data
const posts = [
    {
        id: uuidv4(),
        username: "anuragbansall",
        title: "Welcome to My Blog",
        content: "This is my first blog post!",
        date: 'Tue Jan 07 2025'
    },
    {
        id: uuidv4(),
        username: "sarahjones",
        title: "My Second Blog Post",
        content: "I've been trying to learn more about programming!",
        date: 'Tue Jan 07 2025'
    },
]

app.get('/posts', (req, res) => {
    res.render("index.ejs", {posts})
})

app.get('/posts/new', (req, res) => {
    res.render("new.ejs", { post: null })
})

app.get('/posts/:id', (req, res) => {
    const { id } = req.params
    const post = posts.find(p => p.id === id);
    res.render("show.ejs", { post })
})

app.post('/posts', (req, res) => {
    const { username, title, content } = req.body
    const id = uuidv4()
    const date = new Date().toDateString()
    posts.push({ username, title, content, id, date })
    res.redirect('/posts')
})

app.get('/posts/:id/edit', (req, res) => {
    const { id } = req.params;
    const post = posts.find(p => p.id === id);
    res.render('new.ejs', { post });
});

app.patch("/posts/:id", (req, res) => {
    const { id } = req.params;
    const postIndex = posts.findIndex(p => p.id === id);
    const newPost = req.body;
    if (postIndex!== -1) {
        posts[postIndex] = {...posts[postIndex], ...newPost };
        res.redirect(`/posts/${id}`);
    }
    else {
        res.status(404).send('Post not found')
    }
})

const port = 3000

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})