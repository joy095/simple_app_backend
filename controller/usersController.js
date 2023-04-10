const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc Get all users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users.length) {
    return res.status(404).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create all users
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, mobile, email, password } = req.body;

  // confirm date
  if (!firstname || !lastname || !mobile || !email || !password) {
    return res.status(400).json({ message: "All field are required" });
  }
  // Check for duplicate
  const duplicate = await User.findOne({ email }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  // Hash password
  const hashPwd = await bcrypt.hash(password, 10); // salt rounds

  const userObject = { firstname, lastname, password: hashPwd, mobile, email };

  // Create and store new User
  const user = await User.create(userObject);

  if (user) {
    // created
    res
      .status(201)
      .json({ message: `New user ${firstname} ${lastname}created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, firstname, lastname, mobile, email, password } = req.body;

  // Confirm data
  if (!id || !firstname || !lastname || !mobile || !email) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // Does the user exist to update?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ email }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Email" });
  }

  user.email = email;
  user.firstname = firstname;
  user.lastname = lastname;
  user.mobile = mobile;
  user.email = email;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }

  const updatedUser = await user.save();

  res.json({
    message: `${updatedUser.firstname} ${updatedUser.lastname} updated`,
  });
});

// @desc Delete a users
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Firstname ${result.firstname} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = { createNewUser, getAllUsers, updateUser, deleteUser };
