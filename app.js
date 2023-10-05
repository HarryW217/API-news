const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndPoints } = require("./controllers/api-controllers");
const {
  getArticles,
  getArticleById,
  getArticleCommentsById,
  patchArticlesById,
  postComment,
} = require("./controllers/articles-controllers");

const { deleteComment } = require("./controllers/comments-controllers")

app.use(express.json());

//GET requests
app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

//POST requests
app.post("/api/articles/:article_id/comments", postComment);

// DELETE requests
app.delete("/api/comments/:comment_id", deleteComment);

//PATCH requests
app.patch("/api/articles/:article_id", patchArticlesById);

//Handle 404 errors
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

//Handle custom errors

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  }
  if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required fields" });
  }
  if (err.code === "23503") {
    res.status(400).send({ msg: "Invalid input" });
  }
  res.status(err.status).send({ msg: err.msg });
  next(err);
});

//Handle 500 errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
  console.log(err);
});

module.exports = app;
