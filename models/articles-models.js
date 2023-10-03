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
  /*
    comment_count, which is the total count 
    of all the comments with this article_id.
     You should make use of queries to the database 
     in order to achieve this.
    */
    
    

  return db
    .query(
      `
    SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url FROM articles
    JOIN comments
    ON articles.article_id = comments.article_id
    ORDER BY articles.created_at DESC
    ;`
    )
    .then((result) => {
      const array = result.rows;
      console.log(result.rows);
      return array;
    });
};
