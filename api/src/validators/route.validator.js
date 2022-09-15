const { ObjectId } = require("mongoose").Types;
const { errorResponse, SORT, PROJECTION } = require("../configs/route.config");
const {
  getItemTypeOfEndpoint,
  isPositiveInteger,
} = require("../helpers/helper");
const { COUNTRIES } = require("../models/enum");

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

function parsePageParam(req, res, next) {
  const { page } = req.query;
  if (page === "" || (page && !isPositiveInteger(page)))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  req.query.page = Number(page) || undefined;
  next();
}

function parseLimitParam(req, res, next) {
  const { limit } = req.query;
  if (limit === "" || (limit && !isPositiveInteger(limit)))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  req.query.limit = Number(limit) || undefined;
  next();
}

function parseFieldsParam(req, res, next) {
  const { fields } = req.query;
  if (fields) {
    const fieldsArr = fields.split(",");
    if (
      fieldsArr.length === 0 ||
      fieldsArr.some((f) => f.length === 0) ||
      fields.includes(" ")
    )
      return res.status(400).send(errorResponse.INVALID_QUERY);

    req.query.projection = fieldsArr
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

function parseQueryParam(req, res, next) {
  const { query } = req.query;
  if (!query || query.trim().length === 0) {
    return res.status(400).json(errorResponse.INVALID_QUERY);
  }
  req.query.query = query.trim();
  next();
}

function validateCountryParam(req, res, next) {
  const { country } = req.query;
  if (country && !COUNTRIES.includes(country))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  next();
}

function parseYearParam(req, res, next) {
  const { year } = req.query;
  if (year && !isPositiveInteger(year))
    return res.status(400).json(errorResponse.INVALID_QUERY);
  req.query.year = year ? Number(year) : undefined;
  next();
}

const parseGetItemsParams = [
  parsePageParam,
  parseLimitParam,
  parseFieldsParam,
  validateSortParam,
  parseSortParam,
];

const parseSearchItemsParams = [
  parsePageParam,
  parseLimitParam,
  parseFieldsParam,
  parseQueryParam,
];

module.exports = {
  validateIDParam,
  parsePageParam,
  parseLimitParam,
  parseFieldsParam,
  parseSortParam,
  parseDefaultProjection,
  parseGetItemsParams,
  parseSearchItemsParams,
  validateCountryParam,
  parseYearParam,
};
