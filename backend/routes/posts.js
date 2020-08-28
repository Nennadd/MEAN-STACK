const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostsController = require("../controllers/posts");

// NOTE Fetch All Posts !!!
router.get("/", PostsController.getPosts);

// NOTE Create New Post !!!
router.post("/", checkAuth, extractFile, PostsController.createPost);

// NOTE Update Post !!!
router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

// NOTE Delete Post !!!
router.delete("/:id", checkAuth, PostsController.deletePost);

// NOTE Get One Post !!!
router.get("/:id", PostsController.getPost);

module.exports = router;
