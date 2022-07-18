const {
  errorResponse,
  REFRESH_TOKEN_EXPIRE_TIME,
} = require("../../configs/route.config");
const { rawListeners } = require("../../models/user/user.model");
const userService = require("../../models/user/user.service");
const aesService = require("../../services/aes.service");
const authorizerService = require("../../services/authorizer.service");

const USERNAME_REGEX = /^[a-zA-Z0-9]{6,14}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEX = /^[^\s]{8,}$/;

const tokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "None",
  maxAge: REFRESH_TOKEN_EXPIRE_TIME * 1000, // in ms
};

async function validateRegisterInput(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).send(errorResponse.MISSING_USER_REGISTER_FIELDS);

  if (await userService.exists(username, email)) {
    return res.status(409).send(errorResponse.USER_EXISTS);
  }

  if (!USERNAME_REGEX.test(username))
    return res.status(400).send(errorResponse.INVALID_USERNAME);

  if (!EMAIL_REGEX.test(email))
    return res.status(400).send(errorResponse.INVALID_EMAIL);

  if (!PASSWORD_REGEX.test(password))
    return res.status(400).send(errorResponse.INVALID_PASSWORD);

  next();
}

async function registerUser(req, res, next) {
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: aesService.encrypt(req.body.password),
    };
    const user = await userService.addUser(userData);

    const { _id, isAdmin } = user;
    const accessToken = authorizerService.generateAccessToken(_id, isAdmin);
    const refreshToken = authorizerService.generateRefreshToken(_id, isAdmin);
    await userService.updateUser(user._id, { refreshToken });

    const response = { ...user, accessToken };
    res.cookie("refresh_token", refreshToken, tokenCookieOptions);
    return res.status(201).send(response);
  } catch (error) {
    next(error);
  }
}

async function authenticateUser(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send(errorResponse.MISSING_USER_LOGIN_FIELDS);

  const user = await userService.findUserByEmail(email, null);
  if (!user) {
    return res.status(401).send(errorResponse.WRONG_EMAIL_PASSWORD);
  }

  const correctPassword = aesService.decrypt(user.password);
  if (password !== correctPassword) {
    return res.status(401).send(errorResponse.WRONG_EMAIL_PASSWORD);
  }

  req.user = user;
  next();
}

async function handleLoginUser(req, res, next) {
  try {
    const user = req.user; // Get this from autheticateUser middlewares
    const accessToken = authorizerService.generateAccessToken(
      user._id,
      user.isAdmin
    );
    const refreshToken = authorizerService.generateRefreshToken(
      user._id,
      user.isAdmin
    );

    const updatedUser = await userService.updateUser(user._id, {
      refreshToken,
    });

    const { refreshToken: token, ...response } = updatedUser.toObject();
    response.accessToken = accessToken;
    res.cookie("refresh_token", refreshToken, tokenCookieOptions);
    return res.status(200).send(response);
  } catch (error) {
    next(error);
  }
}

async function handleRefreshToken(req, res) {
  const { id, isAdmin } = req.payload; // from verifyRefreshToken() middleware
  const accessToken = authorizerService.generateAccessToken(id, isAdmin);
  return res.status(200).send({ accessToken });
}

async function handleLogout(req, res, next) {
  try {
    await userService.updateUser(req.payload.id, { refreshToken: "" });
    res.clearCookie("refresh_token", tokenCookieOptions);
    return res.status(200).send({ message: "User has been logged out" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateRegisterInput,
  registerUser,
  authenticateUser,
  handleLoginUser,
  handleRefreshToken,
  handleLogout,
};
