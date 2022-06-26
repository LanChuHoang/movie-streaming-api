const express = require("express");
const authController = require("./auth.controller");
const authorizerService = require("../../services/authorizer.service");

const router = express.Router();

router.post(
  "/register",
  authController.validateRegisterInput,
  authController.registerUser
);

router.post("/login", authController.authenticateUser);

router.get("/authorize", authorizerService.verifyAccessToken, (req, res) => {
  res.send("Authorize success");
});

module.exports = router;
