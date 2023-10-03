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

exports.fetchArticles = () => {
  return db
    .query(
      `
    SELECT COUNT(comments.article_id)::INT AS comment_count , 
    articles.author, title, articles.article_id, topic,
    articles.created_at, articles.votes, article_img_url FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `
    )
    .then((result) => {
      if (result.rows.length > 0) {
        const array = result.rows;
        return array;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Articles not found!",
        });
      }
    });
};
