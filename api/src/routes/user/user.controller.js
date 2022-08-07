const { default: mongoose } = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const userModel = require("../../models/user/user.model");
const aesService = require("../../services/aes.service");

async function validateGetUsersInput(req, res, next) {
  const { page, limit } = req.query;
  const isPositiveNumber = (n) => isFinite(Number(n)) && Number(n) > 0;
  if (page && !isPositiveNumber(page))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  if (limit && !isPositiveNumber(limit))
    return res.status(400).send(errorResponse.INVALID_QUERY);
  next();
}

// GET /user?page=1 & limit=1 & sort_by=_id:desc
async function getUsers(req, res, next) {
  const { page, limit, sort_by: sortOptions } = req.query;
  const sort = sortOptions ? {} : null;
  sortOptions?.split(",").forEach((option) => {
    [field, order] = option.split(":");
    sort[field] = order;
  });

  try {
    const [users, totalDocs] = await Promise.all([
      userModel.getAllUsers(page, limit, sort),
      userModel.getTotalUsers(),
    ]);

    const pageSize = limit || userModel.USERS_DEFAULT_PAGE_SIZE;
    const totalDocuments = totalDocs || 0;
    const totalPages = Math.ceil(totalDocuments / pageSize);
    const responseData = {
      docs: users,
      page: page || 1,
      pageSize,
      totalPages,
      totalDocuments,
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

async function getUser(req, res, next) {
  try {
    const user = await userModel.findUserByID(req.params.id);
    if (!user) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    if (req.body.password) {
      req.body.password = aesService.encrypt(req.body.password);
    }
    const updatedUser = await userModel.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).send(errorResponse.DEFAULT_404_ERROR);
    }
    return res.status(200).json(updatedUser);
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
    return res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateGetUsersInput,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
