const { PROJECTION } = require("../configs/route.config");
const { getItemTypeOfEndpoint } = require("../helpers/helper");
const {
  validateGetItemsParams,
  validateSearchItemsParams,
} = require("../validators/route.validator");

function parseDefaultProjection(req, res, next) {
  const itemType = getItemTypeOfEndpoint(req.originalUrl);
  const defaultProjection = req.user?.isAdmin
    ? PROJECTION.ADMIN.DEFAULT[itemType]
    : PROJECTION.USER.DEFAULT[itemType];
  req.query.defaultProjection = defaultProjection;
  next();
}

function parsePaginationParams(req, res, next) {
  const { page, limit, fields } = req.query;
  if (page) req.query.page = Number(page);
  if (limit) req.query.limit = Number(limit);
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

function parseSortParam(req, res, next) {
  const { sort } = req.query;
  if (sort) {
    const [field, order] = sort.split(":");
    req.query.sort = { [field]: order === "asc" ? 1 : -1 };
  }
  next();
}

function parseQueryParam(req, res, next) {
  req.query.query = query.trim();
  next();
}

const parseGetItemsParams = [
  validateGetItemsParams,
  parsePaginationParams,
  parseSortParam,
];

const parseSearchItemsParams = [
  validateSearchItemsParams,
  parsePaginationParams,
  parseSortParam,
];

module.exports = {
  parseDefaultProjection,
  parseGetItemsParams,
  parseSearchItemsParams,
};
