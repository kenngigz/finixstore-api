const bcrypt = require("bcrypt");

const db = require("../models");

// create main Model
const User = db.User;
const Order = db.Order;

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  // Get all users from MongoDB
  const users = await User.findAll();

  // console.log("users", users);
  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate username
  const duplicate = await User.findOne({
    where: { username: username },
  });
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  // Hash password
  //   const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject =
    !Array.isArray(roles) || !roles.length
      ? { username, password }
      : { username, password, roles };

  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  // Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({
    where: { username: username },
  });
  //   console.log("duplicate", duplicate.id);
  //   console.log("id", id);
  // Allow updates to the original user
  if (duplicate && duplicate?.id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Hash password
    // user.password = await bcrypt.hash(password, 10); // salt rounds
    user.password = password; // salt rounds
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
};

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user still have assigned orders?
  const order = await Order.findOne({
    where: { userId: id },
  });

  if (order) {
    return res.status(400).json({ message: "User has assigned orders" });
  }

  // Does the user exist to delete?
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.destroy();
  //   console.log("result", result);
  // Delete the order
  //   await order.destroy();

  const reply = `Username ${result.username} with ID ${result.id} deleted`;

  res.json(reply);
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
