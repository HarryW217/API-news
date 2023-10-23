const endPoints = require("../db/endpoints.json");

exports.getEndPoints = (req, res, next) => {
  res
    .status(200)
    .send({ endPoints })
    .catch((err) => {
      next(err);
    });
};