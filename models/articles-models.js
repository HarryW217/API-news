const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then((result) => {
      if (result.rows.length > 0) {
        const obj = result.rows[0];
        return obj;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Article not found!",
        });
      }
    });
};

exports.fetchArticleCommentsById = (article_id) => {
  return db
    .query(
      `
  SELECT comment_Id, comments.body, comments.votes,
  comments.author, comments.article_id, comments.created_at
  FROM comments
  JOIN articles
  ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  ORDER BY comments.created_at DESC;
  `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
          const commentsArr = result.rows;
      return commentsArr;
      } else {
          return Promise.reject({
            status: 404,
            msg: "Article comments not found!",
          });
      }
    
    });
};
