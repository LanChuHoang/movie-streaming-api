const { PROJECTION } = require("../../configs/route.config");
const { getSunday, getMonday } = require("../../helpers/helper");
const User = require("./User");

const DEFAULT_PROJECTION = {
  __v: 0,
  updatedAt: 0,
  password: 0,
};

const USERS_DEFAULT_PAGE_SIZE = 10;

async function exists(username, email) {
  return (
    (await User.exists({
      $or: [{ username: username }, { email: email }],
    })) !== null
  );
}

async function addUser(user) {
  try {
    const createdUser = await User.create(user);
    const { __v, updatedAt, password, ...output } = createdUser.toObject();
    return output;
  } catch (error) {
    throw error;
  }
}

function findUserByID(id, projection = DEFAULT_PROJECTION) {
  return User.findById(id, projection);
}

function findUserByEmail(email, projection = DEFAULT_PROJECTION) {
  return User.findOne({ email: email }, projection);
}

function getAllUsers(
  page = 1,
  limit = USERS_DEFAULT_PAGE_SIZE,
  sort = null,
  projection = PROJECTION.USER.DEFAULT.USER
) {
  return User.find({}, projection)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit);
}

function getNewUsers(amount, projection = DEFAULT_PROJECTION) {
  return User.find({}, projection).sort({ _id: -1 }).limit(amount);
}

function updateUser(id, updateData, projection = DEFAULT_PROJECTION) {
  return User.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    projection: projection,
  });
}

function deleteUserByID(id, projection = DEFAULT_PROJECTION) {
  return User.findByIdAndDelete(id, { projection: projection });
}

// Statistics

function getTotalUsers() {
  return User.estimatedDocumentCount();
}

function countUsers(startDate = null, endDate = null) {
  const filter = { isAdmin: false };
  if (startDate && endDate)
    filter.createdAt = { $gte: startDate, $lte: endDate };
  return User.find(filter).count();
}

function countUsersDaily(startDate, endDate) {
  return User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        isAdmin: false,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, date: "$_id", totalUsers: 1 },
    },
    { $sort: { date: 1 } },
  ]);
}

function countUsersMonthly(startDate, endDate) {
  return User.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        isAdmin: false,
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalUsers: { $sum: 1 },
      },
    },
    {
      $project: { _id: 0, month: "$_id", totalUsers: 1 },
    },
    { $sort: { month: 1 } },
  ]);
}

module.exports = {
  USERS_DEFAULT_PAGE_SIZE,
  exists,
  addUser,
  findUserByID,
  findUserByEmail,
  getAllUsers,
  getNewUsers,
  updateUser,
  deleteUserByID,
  getTotalUsers,
  countUsers,
  countUsersDaily,
  countUsersMonthly,
};
