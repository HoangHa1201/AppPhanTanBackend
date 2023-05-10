const express = require("express");
const router = express.Router();

const Post = require('../model/Post');


// get all the posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.json({ message: error });
    }
})
// get details data
router.get('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (error) {
        res.json({ message: error });
    }
})

// submit a post
router.post('/', async (req, res) => {

    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        linkImg: req.body.linkImg
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (error) {
        res.json({ message: error });
    }
});
// update a post
router.patch('/:postId', async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    linkImg: req.body.linkImg
                },
            }
        );
        res.json(updatedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

// delete a post
router.delete('/:postId', async (req, res) => {
    try {
        const removedPost = await Post.remove({ _id: req.params.postId });
        res.json(removedPost);
    } catch (error) {
        res.json({ message: error });
    }
});

module.exports = router;