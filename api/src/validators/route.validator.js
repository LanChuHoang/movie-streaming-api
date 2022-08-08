const { ObjectId } = require("mongoose").Types;
const { errorResponse, SORT } = require("../configs/route.config");
const { getItemTypeOfEndpoint } = require("../helpers/helper");

function validateIDParam(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  next();
}

function validatePageParam(req, res, next) {
  if (req.query.page) {
    req.query.page = Number(req.query.page);
    if (isNaN(req.query.page))
      return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  next();
}

function validateSearchParams(req, res, next) {
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
}

function validatePaginationInput(req, res, next) {
  const { page, limit, sort, fields } = req.query;
  const isPositiveNumber = (n) => isFinite(Number(n)) && Number(n) > 0;
  if (page && !isPositiveNumber(page))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  if (limit && !isPositiveNumber(limit))
    return res.status(400).send(errorResponse.INVALID_QUERY);

  const itemType = getItemTypeOfEndpoint(req.originalUrl);

  if (sort) {
    const [field, order] = sort.split(":");
    const sortFields = req.user?.isAdmin
      ? SORT.FIELDS.ADMIN[itemType]
      : SORT.FIELDS.USER[itemType];
    if (!sortFields?.includes(field) || !SORT.ORDERS?.includes(order))
      return res.status(400).send(errorResponse.INVALID_QUERY);
  }

  if (fields) {
    const fieldsArr = fields.split(",");
    if (fieldsArr.length === 0 || fields.includes(" "))
      return res.status(400).send(errorResponse.INVALID_QUERY);
  }

  next();
}

module.exports = {
  validateIDParam,
  validatePageParam,
  validateSearchParams,
  validatePaginationInput,
};
