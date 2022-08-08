const { PROJECTION } = require("../configs/route.config");
const { getItemTypeOfEndpoint } = require("../helpers/helper");

function parsePaginationOptions(req, res, next) {
  const { page, limit, sort, fields } = req.query;
  if (page) req.query.page = Number(page);
  if (limit) req.query.limit = Number(limit);
  if (sort) {
    const [field, order] = sort.split(":");
    req.query.sort = { [field]: order === "asc" ? 1 : -1 };
  }

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

function parseDefaultProjection(req, res, next) {
  const itemType = getItemTypeOfEndpoint(req.originalUrl);
  const defaultProjection = req.user?.isAdmin
    ? PROJECTION.ADMIN.DEFAULT[itemType]
    : PROJECTION.USER.DEFAULT[itemType];
  req.query.defaultProjection = defaultProjection;
  next();
}

module.exports = {
  parsePaginationOptions,
  parseDefaultProjection,
};
