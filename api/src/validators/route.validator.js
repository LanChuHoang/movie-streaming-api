const { ObjectId } = require("mongoose").Types;
const { errorResponse, SORT, PROJECTION } = require("../configs/route.config");
const { getItemTypeOfEndpoint } = require("../helpers/helper");

function validateIDParam(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  next();
}

function parseDefaultProjection(req, res, next) {
  const itemType = getItemTypeOfEndpoint(req.originalUrl);
  const defaultProjection = req.user?.isAdmin
    ? PROJECTION.ADMIN.DEFAULT[itemType]
    : PROJECTION.USER.DEFAULT[itemType];
  req.query.defaultProjection = defaultProjection;
  next();
}

function validatePaginationParams(req, res, next) {
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

function parsePaginationParams(req, res, next) {
  const { page, limit, fields } = req.query;
  req.query.page = page ? Number(page) : undefined;
  req.query.limit = limit ? Number(limit) : undefined;
  if (fields) {
    req.query.projection = fields
      .split(",")
      .filter((f) => req.query.defaultProjection[f] !== 0)
      .reduce((prevResult, f) => ({ ...prevResult, [f]: 1 }), {});
  } else {
    req.query.projection = req.query.defaultProjection;
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

function parseSortParam(req, res, next) {
  const { sort } = req.query;
  if (sort) {
    const [field, order] = sort.split(":");
    req.query.sort = { [field]: order === "asc" ? 1 : -1 };
  } else {
    req.query.sort = undefined;
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

function parseQueryParam(req, res, next) {
  const { query } = req.query;
  req.query.query = query.trim();
  next();
}

const parseGetItemsParams = [
  validatePaginationParams,
  parsePaginationParams,
  validateSortParam,
  parseSortParam,
];

const parseSearchItemsParams = [
  validatePaginationParams,
  parsePaginationParams,
  validateQueryParam,
  parseQueryParam,
];

module.exports = {
  validateIDParam,
  parseDefaultProjection,
  parseGetItemsParams,
  parseSearchItemsParams,
};
