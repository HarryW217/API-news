const {
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  alterArticleVotesById,
  insertComment,
} = require("../models/articles-models");

const { fetchTopics } = require("../models/topics-models");

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  const query = req.query
  fetchArticleById(articleId,query)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleCommentsById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleCommentsById(articleId)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const query = req.query;
  const queryKeys = Object.keys(query);
  if (queryKeys.length === 0) {
    fetchArticles(query)
      .then((articles) => {
        res.status(200).send(articles);
      })
      .catch((err) => {
        next(err);
      });
  } else {
    fetchTopics().then((topics) => {
      const topicMatches = topics.filter((topic) => topic.slug === query.topic);
      if (topicMatches.length > 0) {
        fetchArticles(query).then((articles) => {
          res.status(200).send(articles);
        });
      } else {
        return Promise.reject({
          status: 404,
          msg: "No articles found of this topic!",
        }).catch((err) => {
          next(err);
        });
      }
    });
  }
};

exports.postComment = (req, res, next) => {
  const article_id = req.params.article_id;
  const username = req.body.username;
  const body = req.body.body;
  insertComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  const votesUpdate = req.body.inc_votes;
  alterArticleVotesById(articleId, votesUpdate)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
