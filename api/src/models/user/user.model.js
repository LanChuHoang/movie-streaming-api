const { PROJECTION } = require("../../configs/route.config");
const { USERS_DEFAULT_PAGE_SIZE } = require("../../configs/route.config.user");
const User = require("./User");

async function getPaginatedUsers(filter = null, sort, page, limit, projection) {
  try {
    const docsPipeline = [
      { $skip: limit * (page - 1) },
      { $limit: limit },
      { $project: projection },
    ];
    if (sort) docsPipeline.unshift({ $sort: sort });
    console.log(docsPipeline);
    const [result] = await User.aggregate([
      { $match: filter },
      {
        $facet: {
          docs: docsPipeline,
          meta: [{ $count: "total_documents" }],
        },
      },
      { $unwind: "$meta" },
    ]);

    const totalDocs = result?.meta.total_documents || 0;
    const output = {
      docs: result?.docs || [],
      page: page,
      pageSize: limit,
      totalPages: Math.ceil(totalDocs / limit),
      totalDocuments: totalDocs,
    };

    return output;
  } catch (error) {
    throw error;
  }
}

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

function getUsers(
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

function searchUsers({
  query,
  page = 1,
  limit = USERS_DEFAULT_PAGE_SIZE,
  projection = PROJECTION.ADMIN.DEFAULT.USER,
}) {
  const regExp = new RegExp(query, "gi");
  const filter = { $or: [{ username: regExp }, { email: regExp }] };
  return getPaginatedUsers(filter, null, page, limit, projection);
}

function getUserById(id, projection) {
  return User.findById(id, projection);
}

function getUserByEmail(email, projection = PROJECTION.USER.DEFAULT.USER) {
  return User.findOne({ email: email }, projection);
}

function updateUser(id, updateData, projection = PROJECTION.USER.DEFAULT.USER) {
  return User.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    projection: projection,
  });
}

function deleteUserByID(id) {
  return User.findByIdAndDelete(id, {
    projection: PROJECTION.ADMIN.DEFAULT.USER,
  });
}

// Statistics
function getTotalUsers() {
  return User.estimatedDocumentCount();
}

function countUsers(startDate = null, endDate = null) {
  const filter = {};
  if (startDate && endDate)
    filter.createdAt = { $gte: startDate, $lte: endDate };
  return User.find(filter).count();
}

function countUsersDaily(startDate, endDate) {
  return User.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalUsers: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", totalUsers: 1 } },
    { $sort: { date: 1 } },
  ]);
}

function countUsersMonthly(startDate, endDate) {
  return User.aggregate([
    { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalUsers: { $sum: 1 },
      },
    },
    { $project: { _id: 0, month: "$_id", totalUsers: 1 } },
    { $sort: { month: 1 } },
  ]);
}

module.exports = {
  USERS_DEFAULT_PAGE_SIZE,
  exists,
  addUser,
  getUsers,
  searchUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUserByID,
  getTotalUsers,
  countUsers,
  countUsersDaily,
  countUsersMonthly,
};
