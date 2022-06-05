const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const DEFAULT_TOKEN_AVAILABLE_TIME = 30 * 60;

function generateAccessToken(user) {
  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: DEFAULT_TOKEN_AVAILABLE_TIME }
  );
  return token;
}

function verifyAccessToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ error: "Unauthorize" });
  }
  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError)
      return res.status(403).send({ error: "Invalid token" });
    return res.status(400).send({ error: "Invalid request" });
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send({ error: "Permission denined" });
  next();
}

function authorizeUserOrAdmin(req, res, next) {
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).send({ error: "Permission denined" });
  }
  next();
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  authorizeUserOrAdmin,
  authorizeAdmin,
};
