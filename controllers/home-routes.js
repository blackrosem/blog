const router = require('express').Router();
const { Posts } = require('../models');
const { User } = require('../models');

router.get('/', async (req, res) => {
    try {
        const postsData = await Posts.findAll({
            include : [
                {
                model: Posts,
                attributes: ['title', 'contents', 'username', 'dateCreated'],
                },
            ],
        });

        const allPosts = postsData.map((posts) => 
        posts.get({ plain: true})
        );
        res.render('homepage', {
            allPosts,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Get all posts by users
router.get('/posts/:user_id', async (req, res) => {
    try {
        const myPosts = await Posts.findAll({
            where: {user_id: User.id },
            include : [
                {
                model: Posts,
                attributes: [
                    'title',
                    'content',
                    'username',
                    'dateCreated',
                ],
            }
            ],
        });
        const thePosts = myPosts.get({ plain: true });
        res.render('thePosts', { thePosts, loggedIn: req.session.loggedIn });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if(req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

router.post('/posts', (req, res) => {
    const newPost = {
        title: req.body.title,
        contents: req.body.contents,
        username: User.id,
        dateCreated: DATE.NOW,
    };
    Posts.push(newPost);
    res.json(newPost);
});

router.put('/posts/:id', (req, res) => {
    const thePost = Posts.find((p) => p.id === parseInt(req.params.id));
    if(!thePost){
        res.status(404).send('Post not found');
    }
    thePost.title = req.body.title;
    thePost.contents = req.body.contents;
    thePost.username = User.id;
    thePost.dateCreated = DATE.NOW;
    res.json(thePost);
});
