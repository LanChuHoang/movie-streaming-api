const express = require("express");
const userController = require("./user.controller");
const authorizerService = require("../../services/authorizer.service");
const routeValidator = require("../../validators/route.validator");

const router = express.Router();

router.use(
  authorizerService.verifyAccessToken,
  routeValidator.parseDefaultProjection
);

// GET All Users: GET /user
// by Admin
// Output user infor except password, __v, updateAt
router.get(
  "/",
  authorizerService.authorizeAdmin,
  routeValidator.parseGetItemsParams,
  userController.getUsers
);

router.get(
  "/search",
  authorizerService.authorizeAdmin,
  routeValidator.parseSearchItemsParams,
  userController.searchUsers
);

// GET Single User: GET /user/:id
// by Admin or Owner User
// Output user infor except password, __v, createdAt, updateAt
router.get(
  "/:id",
  routeValidator.validateIDParam,
  authorizerService.authorizeUserOrAdmin,
  userController.getUser
);

// UPDATE User Profile: PATCH /user/:id
// by Admin or Owner User
// Output updated user infor except password, __v, createdAt, updateAt
router.patch(
  "/:id",
  routeValidator.validateIDParam,
  authorizerService.authorizeUserOrAdmin,
  userController.updateUser
);

// DELETE Single User: DELETE /user/:id
// by Admin or Owner User
// Output deleted user infor except password, __v, createdAt, updateAt
router.delete(
  "/:id",
  routeValidator.validateIDParam,
  authorizerService.authorizeUserOrAdmin,
  userController.deleteUser
);

module.exports = router;
