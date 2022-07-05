const userModel = require("./user.model");

const DEFAULT_PROJECTION = {
  __v: 0,
  createdAt: 0,
  updatedAt: 0,
  password: 0,
};

async function exists(username, email) {
  return (
    (await userModel.exists({
      $or: [{ username: username }, { email: email }],
    })) !== null
  );
}

async function addUser(user) {
  try {
    const createdUser = await userModel.create(user);
    const { __v, createdAt, updatedAt, password, ...output } =
      createdUser.toObject();
    return output;
  } catch (error) {
    throw error;
  }
}

function findUserByID(id, projection = DEFAULT_PROJECTION) {
  return userModel.findById(id, projection);
}

function findUserByEmail(email, projection = DEFAULT_PROJECTION) {
  return userModel.findOne({ email: email }, projection);
}

async function getAllUsers(
  afterID = null,
  limit = 10,
  sort = null,
  projection = DEFAULT_PROJECTION
) {
  try {
    let filter = {};
    if (afterID && sort) {
      const firstSortField = Object.keys(sort)[0];
      const pivot = (await userModel.findById(afterID))[firstSortField];
      filter[firstSortField] = { $gt: pivot };
    } else if (afterID) {
      filter = { _id: { $gt: afterID } };
    }
    return await userModel.find(filter, projection).sort(sort).limit(limit);
  } catch (error) {
    throw error;
  }
}

function getNewUsers(amount, projection = DEFAULT_PROJECTION) {
  return userModel.find({}, projection).sort({ _id: -1 }).limit(amount);
}

function updateUser(id, updateData, projection = DEFAULT_PROJECTION) {
  return userModel.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    projection: projection,
  });
}

function deleteUserByID(id, projection = DEFAULT_PROJECTION) {
  return userModel.findByIdAndDelete(id, { projection: projection });
}

function getNumUserPerMonth() {
  return userModel.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        numUsers: { $sum: 1 },
      },
    },
    {
      $project: {
        month: "$_id",
        numUsers: 1,
        _id: 0,
      },
    },
  ]);
}

module.exports = {
  exists,
  addUser,
  findUserByID,
  findUserByEmail,
  getAllUsers,
  getNewUsers,
  updateUser,
  deleteUserByID,
  getNumUserPerMonth,
};
