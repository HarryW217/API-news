const { deleteCommentById } = require("../models/comments-models");

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_id;
  deleteCommentById(commentId)
    .then(() => {
      res.status(204).send()
    })
    .catch((err) => {
      next(err);
    });
};