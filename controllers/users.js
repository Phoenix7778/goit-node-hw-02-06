const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { getToken } = require("../utils/getToken");
const { createHashPassword } = require("../utils/createHashPassword");

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const ctrlWrapper = (ctrl) => async (req, res, next) => {
  try {
    await ctrl(req, res, next);
  } catch (error) {
    next(error);
  }
};

const getCurrent = ctrlWrapper(async (req, res) => {
  if (!req.user) {
    throw httpError(401, "Not authorized");
  }
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
});

const login = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw httpError(401, "Email or password is wrong");
  }
  const token = await getToken(user._id);
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
});

const logout = ctrlWrapper(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: "" });
  res.status(200).json({ message: "No Content" });
});

const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw httpError(409, "Email in use");
  }
  const newUser = await User.create({
    ...req.body,
    password: await createHashPassword(password),
  });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
});

const updateSubscriptionUser = ctrlWrapper(async (req, res) => {
  const { body, params } = req;
  const { id } = params;
  const result = await User.findByIdAndUpdate(id, body, { new: true });
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.status(200).json(result);
});

module.exports = {
  getCurrent,
  login,
  logout,
  register,
  updateSubscriptionUser,
};
