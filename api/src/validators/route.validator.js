const { ObjectId } = require("mongoose").Types;
const { errorResponse, SORT } = require("../configs/route.config");
const { getItemTypeOfEndpoint } = require("../helpers/helper");

function validateIDParam(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  next();
}

function validatePageinationParams(req, res, next) {
  const { page, limit, fields } = req.query;
  const isPositiveNumber = (n) => Number.isInteger(Number(n)) && Number(n) > 0;
  if (page && !isPositiveNumber(page))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  if (limit && !isPositiveNumber(limit))
    return res.status(400).send(errorResponse.INVALID_QUERY);

  if (fields) {
    const fieldsArr = fields.split(",");
    if (
      fieldsArr.length === 0 ||
      fieldsArr.some((f) => f.length === 0) ||
      fields.includes(" ")
    )
      return res.status(400).send(errorResponse.INVALID_QUERY);
  }
  next();
}

function validateSortParam(req, res, next) {
  const { sort } = req.query;
  if (sort) {
    const itemType = getItemTypeOfEndpoint(req.originalUrl);
    const sortOption = sort.split(":");
    if (
      sortOption.length !== 2 ||
      sortOption.some((p) => p.length === 0 || p.includes(" "))
    )
      return res.status(400).send(errorResponse.INVALID_QUERY);
    const [field, order] = sortOption;
    const sortFields = req.user?.isAdmin
      ? SORT.FIELDS.ADMIN[itemType]
      : SORT.FIELDS.USER[itemType];
    if (!sortFields?.includes(field) || !SORT.ORDERS?.includes(order))
      return res.status(400).send(errorResponse.INVALID_QUERY);
  }
  next();
}

function validateQueryParam(req, res, next) {
  const { query } = req.query;
  if (!query || query.trim().length === 0) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  next();
}

const validateGetItemsParams = [validatePageinationParams, validateSortParam];
const validateSearchItemsParams = [
  validatePageinationParams,
  validateQueryParam,
];

module.exports = {
  validateIDParam,
  validateGetItemsParams,
  validateSearchItemsParams,
};
