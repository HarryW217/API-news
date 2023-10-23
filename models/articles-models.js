const db = require("../db/connection");

exports.fetchArticleById = (article_id, query) => {
  if (query.hasOwnProperty("comment_count")) {
    return db
      .query(
        `
    SELECT articles.*, 
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE comments.article_id = $1
    GROUP BY articles.article_id;
    `,
        [article_id]
      )
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
  }
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

exports.fetchArticles = (query) => {
  const baseQuery = `
    SELECT COUNT(comments.article_id)::INT AS comment_count , 
    articles.author, title, articles.article_id, topic,
    articles.created_at, articles.votes, article_img_url FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
  if (query.hasOwnProperty("topic")) {
    const finalQuery =
      baseQuery +
      `
     WHERE topic = $1
     GROUP BY articles.article_id  
     ORDER BY articles.created_at DESC;
    `;
    return db.query(finalQuery, [query.topic]).then((result) => {
      if (result.rows) {
        const articlesByTopic = result.rows;
        return articlesByTopic;
      } else {
        return Promise.reject({
          status: 404,
          msg: "No articles of this topic!",
        });
      }
    });
  } else {
    const finalQuery =
      baseQuery +
      `GROUP BY articles.article_id
     ORDER BY articles.created_at DESC;
    `;
    return db.query(finalQuery).then((result) => {
      const articlesArr = result.rows;
      return articlesArr;
    });
  }
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
      const comment = result.rows[0];
      return comment;
    });
};

exports.alterArticleVotesById = (article_id, votesUpdate) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = articles.votes+$1
      WHERE article_id = $2
      RETURNING *;
      `,
      [votesUpdate, article_id]
    )
    .then((result) => {
      if (result.rows.length > 0) {
        const article = result.rows[0];
        return article;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Article not found!",
        });
      }
    });
};
