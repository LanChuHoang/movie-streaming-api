const MAX_BODY_SIZE = "16mb";

const WHITE_LIST = [
  "http://localhost:3000",
  "https://gr1-client.netlify.app",
  "https://gr1-admin.netlify.app",
];

const CORS_OPTIONS = {
  origin: WHITE_LIST,
  credentials: true,
};

module.exports = {
  MAX_BODY_SIZE,
  CORS_OPTIONS,
};
