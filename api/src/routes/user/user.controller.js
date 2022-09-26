const { default: mongoose } = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const userModel = require("../../models/user/user.model");
const aesService = require("../../services/aes.service");

async function getUsers(req, res, next) {
  try {
    const { page, limit, sort, projection } = req.query;
    const [users, totalUsers] = await Promise.all([
      userModel.getUsers(page, limit, sort, projection),
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
    return res.send(responseData);
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

async function searchUsers(req, res, next) {
  try {
    const { query, page, limit, projection } = req.query;
    const options = { query, page, limit, projection };
    const response = await userModel.searchUsers(options);
    return res.send(response);
  } catch (error) {
    next(error);
  }
}

async function getUser(req, res, next) {
  try {
    const user = await userModel.getUserById(
      req.params.id,
      req.query.defaultProjection
    );
    if (!user) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.send(user);
  } catch (error) {
    next(error);
  }
}

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
    return res.send(updatedUser);
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const deletedUser = await userModel.deleteUserByID(req.params.id);
    if (!deletedUser) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.send(deletedUser);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  searchUsers,
  updateUser,
  deleteUser,
};
