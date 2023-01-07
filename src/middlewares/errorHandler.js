const { errorResponse } = require("../configs/route.config");

function errorHandler(err, req, res, next) {
  console.log(err);
  return res.status(500).send(errorResponse.DEFAULT_500_ERROR);
}

module.exports = errorHandler;
