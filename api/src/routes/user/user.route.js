const express = require("express");
const userController = require("./user.controller");
const authorizerService = require("../../services/authorizer.service");

const router = express.Router();

// router.use(authorizerService.verifyAccessToken);

// GET All Users: GET /user
// by Admin
// Output user infor except password, __v, createdAt, updateAt
router.get(
  "/",
  // authorizerService.authorizeAdmin,
  userController.getAllUsers
);

// GET Single User: GET /user/:id
// by Admin or Owner User
// Output user infor except password, __v, createdAt, updateAt
router.get(
  "/:id",
  // authorizerService.authorizeUserOrAdmin,
  userController.getUser
);

// UPDATE User Profile: PUT /user/:id
// by Admin or Owner User
// Output updated user infor except password, __v, createdAt, updateAt
router.patch(
  "/:id",
  // authorizerService.authorizeUserOrAdmin,
  userController.updateUser
);

// DELETE Single User: DELETE /user/:id
// by Admin or Owner User
// Output deleted user infor except password, __v, createdAt, updateAt
router.delete(
  "/:id",
  // authorizerService.authorizeUserOrAdmin,
  userController.deleteUser
);

// GET Number of user per month: GET /user/stats/
// by Admin
// Output user infor except password, __v, createdAt, updateAt
router.get(
  "/stats/",
  authorizerService.authorizeAdmin,
  userController.getNumUserPerMonth
);

module.exports = router;
