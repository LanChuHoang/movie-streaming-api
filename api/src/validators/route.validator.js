const { ObjectId } = require("mongoose").Types;
const { errorResponse } = require("../configs/route.config");

module.exports = {
  validateIDParam: (req, res, next) => {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json(errorResponse.INVALID_QUERY);
    }
    next();
  },

  validatePageParam: (req, res, next) => {
    if (req.query.page) {
      req.query.page = Number(req.query.page);
      if (isNaN(req.query.page))
        return res.status(400).json(errorResponse.INVALID_QUERY);
    }
    next();
  },

  validateSearchParams: (req, res, next) => {
    if (req.query.page) {
      req.query.page = Number(req.query.page);
      if (isNaN(req.query.page))
        return res.status(400).json(errorResponse.INVALID_QUERY);
    }

    if (!req.query.query || req.query.query.trim().length === 0) {
      return res.status(400).json(errorResponse.INVALID_QUERY);
    }
    req.query.query = req.query.query.trim();

    next();
  },
};
