const { default: mongoose } = require("mongoose");
const { errorResponse } = require("../../configs/route.config");
const userModel = require("../../models/user/user.model");
const aesService = require("../../services/aes.service");

// GET /user?after_id:0&limit=10&sort_by=_id:desc
async function getAllUsers(req, res) {
  const { after_id: afterID, limit, sort_by: sortOptions } = req.query;
  const sort = sortOptions ? {} : null;
  sortOptions?.split(",").forEach((option) => {
    [field, order] = option.split(":");
    sort[field] = order;
  });

  try {
    const users = await userModel.getAllUsers(afterID, limit, sort);
    const responseData = {
      docs: users,
      afterID: afterID ? afterID : null,
      limit: limit ? limit : 10,
      sort: sort,
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
    return res.status(500).send(errorResponse.DEFAULT_500_ERROR);
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

async function getNumUserPerMonth(req, res, next) {
  try {
    const data = await userModel.getNumUserPerMonth();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getNumUserPerMonth,
};
