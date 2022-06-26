const { errorResponse } = require("../../configs/route.config");
const userService = require("../../models/user/user.service");
const aesService = require("../../services/aes.service");
const authorizerService = require("../../services/authorizer.service");

const USERNAME_REGEX = /^[a-zA-Z0-9]{6,14}$/;
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const PASSWORD_REGEX = /^[^\s]{8,}$/;

async function validateRegisterInput(req, res, next) {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json(errorResponse.MISSING_USER_REGISTER_FIELDS);

  if (await userService.exists(username, email)) {
    return res.status(409).json(errorResponse.USER_EXISTS);
  }

  if (!USERNAME_REGEX.test(username))
    return res.status(400).json(errorResponse.INVALID_USERNAME);

  if (!EMAIL_REGEX.test(email))
    return res.status(400).json(errorResponse.INVALID_EMAIL);

  if (!PASSWORD_REGEX.test(password))
    return res.status(400).json(errorResponse.INVALID_PASSWORD);

  next();
}

async function registerUser(req, res) {
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: aesService.encrypt(req.body.password),
    };
    const user = await userService.addUser(userData);
    user.accessToken = authorizerService.generateAccessToken(user);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send(errorResponse.DEFAULT_500_ERROR);
  }
}

async function authenticateUser(req, res) {
  const user = await userService.findUserByEmail(req.body.email, null);
  if (!user) {
    return res.status(401).send({ error: "Wrong email or password" });
  }

  const correctPassword = aesService.decrypt(user.password);
  if (!req.body === correctPassword) {
    return res.status(401).send({ error: "Wrong email or password" });
  }

  const accessToken = authorizerService.generateAccessToken(user);
  return res.status(200).send({ accessToken: accessToken });
}

module.exports = {
  validateRegisterInput,
  registerUser,
  authenticateUser,
};
