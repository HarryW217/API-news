const { fetchArticleById } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
      .then((article) => {
      res.status(200).send(article);
    })
      .catch((err) => {
      next(err);
    });
};
