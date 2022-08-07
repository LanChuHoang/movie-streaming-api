function parseSortOption(req, res, next) {
  if (req.query.sort) {
    const [field, order] = req.query.sort.split(":");
    req.query.sort = { [field]: order === "asc" ? 1 : -1 };
  }
  next();
}

module.exports = {
  parseSortOption,
};
