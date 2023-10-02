const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.message });
  }
  next(err);
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error" });
    console.log(err);
});

module.exports = app;
