const { errorResponse } = require("../../configs/route.config");
const userService = require("../../models/user/user.service");
const aesService = require("../../services/aes.service");
const authorizerService = require("../../services/authorizer.service");

async function validateRegisterInput(req, res) {
  if (await userService.isExists(req.body)) {
    return res.status(400).json({
      error: "User already registered",
    });
  }
}

async function registerUser(req, res) {
  await validateRegisterInput(req, res);
  try {
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: aesService.encrypt(req.body.password),
    };
    const user = await userService.addUser(userData);
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
  registerUser,
  authenticateUser,
};
