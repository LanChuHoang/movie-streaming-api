const { default: mongoose } = require("mongoose");
const { errorResponse, projection } = require("../../configs/route.config");
const userModel = require("../../models/user/user.model");
const aesService = require("../../services/aes.service");

// ADMIN GET /user?page=1 & limit=1 & sort=_id:desc
async function getUsers(req, res, next) {
  try {
    const { page, limit, sort, projection } = req.query;
    const [users, totalUsers] = await Promise.all([
      userModel.getAllUsers(page, limit, sort, projection),
      userModel.getTotalUsers(),
    ]);
    const pageSize = limit || userModel.USERS_DEFAULT_PAGE_SIZE;
    const responseData = {
      docs: users,
      page: page || 1,
      pageSize,
      totalPages: Math.ceil(totalUsers / pageSize),
      totalDocuments: totalUsers,
      sort,
    };
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    if (
      error instanceof mongoose.Error.CastError ||
      error instanceof TypeError
    ) {
      return res.status(400).send(errorResponse.INVALID_QUERY);
    }
    next(error);
  }
}

// BOTH
async function getUser(req, res, next) {
  try {
    const user = await userModel.findUserByID(
      req.params.id,
      req.query.defaultProjection
    );
    if (!user) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

// BOTH
async function updateUser(req, res, next) {
  try {
    if (req.body.password) {
      req.body.password = aesService.encrypt(req.body.password);
    }
    const updatedUser = await userModel.updateUser(
      req.params.id,
      req.body,
      req.query.defaultProjection
    );
    if (!updatedUser) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
}

// ADMIN
async function deleteUser(req, res, next) {
  try {
    const deletedUser = await userModel.deleteUserByID(req.params.id);
    if (!deletedUser) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
