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
      const articlesArr = result.rows;
      return articlesArr;
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `
      INSERT INTO comments (article_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [article_id, username, body]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        const comment = result.rows[0];
        return comment;
      } else {
         return Promise.reject({
          status: 404,
          msg: "Article not found!",
        });
      }
    });
};
