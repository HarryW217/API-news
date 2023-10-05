const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndPoints } = require("./controllers/api-controllers");
const {
  getArticles,
  getArticleById,
  getArticleCommentsById,
  patchArticlesById,
} = require("./controllers/articles-controllers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

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
  res.status(err.status).send({ msg: err.msg });
  next(err);
});

//Handle 500 errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
  console.log(err);
});

module.exports = app;
