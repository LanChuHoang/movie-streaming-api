const express = require("express");
const cookieParser = require("cookie-parser");
const authController = require("./auth.controller");
const authorizerService = require("../../services/authorizer.service");

const router = express.Router();

router.use(cookieParser());

router.post(
  "/register",
  authController.validateRegisterInput,
  authController.registerUser
);

router.post(
  "/login",
  authController.authenticateUser,
  authController.handleLoginUser
);

router.get(
  "/refresh_token",
  authorizerService.verifyRefreshToken,
  authController.handleRefreshToken
);

router.post(
  "/logout",
  authorizerService.verifyRefreshToken,
  authController.handleLogout
);

router.get("/authorize", authorizerService.verifyAccessToken, (req, res) => {
  res.send("Authorize success");
});

module.exports = router;
