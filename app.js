const cors = require("cors");
const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndPoints } = require("./controllers/api-controllers");
const { getUsers } = require("./controllers/users-controllers");
const {
  getArticles,
  getArticleById,
  getArticleCommentsById,
  patchArticlesById,
  postComment,
} = require("./controllers/articles-controllers");
const { deleteComment } = require("./controllers/comments-controllers");

app.use(cors());

app.use(express.json());

//GET requests
app.get("/api/topics", getTopics);

app.get("/api", getEndPoints);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

//POST request
app.post("/api/articles/:article_id/comments", postComment);

// DELETE request
app.delete("/api/comments/:comment_id", deleteComment);

//PATCH request
app.patch("/api/articles/:article_id", patchArticlesById);

//Handle 404 errors
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

//Handle custom errors

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23503") {
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
