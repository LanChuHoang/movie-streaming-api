const {
  ACCESS_TOKEN_EXPIRE_TIME,
  REFRESH_TOKEN_EXPIRE_TIME,
  errorResponse,
} = require("../configs/route.config");
const userModel = require("../models/user/user.model");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function generateAccessToken(id, isAdmin) {
  const token = jwt.sign({ id, isAdmin }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRE_TIME,
  });
  return token;
}

function generateRefreshToken(id, isAdmin) {
  const token = jwt.sign(
    { id, isAdmin },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: REFRESH_TOKEN_EXPIRE_TIME }
  );
  return token;
}

function verifyAccessToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).send(errorResponse.DEFAULT_401_ERROR);
  }
  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError)
      return res.status(403).send(errorResponse.INVALID_TOKEN);
    return res.status(400).send(errorResponse.INVALID_QUERY);
  }
}

async function verifyRefreshToken(req, res, next) {
  const token = req.cookies?.refresh_token;
  if (!token) {
    return res.status(401).send(errorResponse.DEFAULT_401_ERROR);
  }
  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    const user = await userModel.getUserById(payload.id, null);
    if (user.refreshToken !== token)
      return res.status(403).send(errorResponse.INVALID_TOKEN);
    req.payload = payload;
    next();
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.JsonWebTokenError)
      return res.status(403).send(errorResponse.INVALID_TOKEN);
    return res.status(400).send(errorResponse.INVALID_QUERY);
  }
}

function authorizeAdmin(req, res, next) {
  if (!req.user.isAdmin)
    return res.status(403).send(errorResponse.DEFAULT_403_ERROR);
  next();
}

function authorizeUserOrAdmin(req, res, next) {
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).send(errorResponse.DEFAULT_403_ERROR);
  }
  next();
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  authorizeUserOrAdmin,
  authorizeAdmin,
};
