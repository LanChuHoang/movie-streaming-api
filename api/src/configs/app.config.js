const MAX_BODY_SIZE = "16mb";

const ORIGIN = "http://localhost:3000";

const CORS_OPTIONS = {
  origin: ORIGIN,
  credentials: true,
};

module.exports = {
  MAX_BODY_SIZE,
  CORS_OPTIONS,
};
