const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        // post: {
        //   id: createdPost._id,
        //   title: createdPost.title,
        //   content: createdPost.content,
        //   imagePath: createdPost.imagePath,
        // },
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Creating a post failed !" });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Posts Failed !" });
    });
};

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  Post.updateOne(
    { _id: req.params.id, creator: req.userData.userId },
    {
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
    }
  )
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update Successful !" });
      } else {
        res.status(401).json({ message: "Not Authorized !" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Updating post failed !" });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((response) => {
      if (response.n > 0) {
        res.status(200).json({ message: "Post deleted !" });
      } else {
        res.status(401).json({ message: "Not Authorized !" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deleting Posts Failed !" });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post Not Found !" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Posts Failed !" });
    });
};
