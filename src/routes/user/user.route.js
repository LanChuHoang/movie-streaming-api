const express = require("express");
const userController = require("./user.controller");
const authorizerService = require("../../services/authorizer.service");
const routeValidator = require("../../validators/route.validator");

const router = express.Router();

router.use(
  authorizerService.verifyAccessToken,
  routeValidator.parseDefaultProjection
);

// GET /user
router.get(
  "/",
  authorizerService.authorizeAdmin,
  routeValidator.parseGetItemsParams,
  userController.getUsers
);

// GET /user/search
router.get(
  "/search",
  authorizerService.authorizeAdmin,
  routeValidator.parseSearchItemsParams,
  userController.searchUsers
);

// GET /user/:id
router.get(
  "/:id",
  routeValidator.validateIDParam,
  authorizerService.authorizeUserOrAdmin,
  userController.getUser
);

// PATCH /user/:id
router.patch(
  "/:id",
  routeValidator.validateIDParam,
  authorizerService.authorizeUserOrAdmin,
  userController.updateUser
);

// DELETE /user/:id
router.delete(
  "/:id",
  routeValidator.validateIDParam,
  authorizerService.authorizeUserOrAdmin,
  userController.deleteUser
);

module.exports = router;
