import express from 'express';
const router = express.Router(); // eslint-disable-line
const postCtrl = require('../controllers/post.controller');
// Get all Posts
router.get('/', postCtrl.getPosts);

// Get one post by cuid
router.get('/:cuid', postCtrl.getPost);

// Add a new Post
router.post('/', postCtrl.addPost);

// Delete a post by cuid
router.delete('/:cuid', postCtrl.deletePost);

module.exports = router;
