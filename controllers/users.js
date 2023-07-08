const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const fs = require("fs/promises");
const { User } = require("../models/user");
const { getToken } = require("../utils/getToken");
const { createHashPassword } = require("../utils/createHashPassword");
const { resizeImage } = require("../utils/resizeImage");

require("dotenv").config();

const avatarsDir = path.join(__dirname, "../../public/avatars");
const { BASE_URL, META_PASSWORD } = process.env;

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

const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: true,
  logger: true,
  debug: true,
  secureConnection: false,
  auth: {
    user: "goit-node-hw-test123@gmail.com",
    pass: META_PASSWORD,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

const sendEmail = async (data) => {
  const email = { ...data, from: "goit-node-hw-test123@gmail.com" };
  await transport.sendMail(email);
  return true;
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

const updateAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  resizeImage(tempUpload);

  const filename = `${_id}_${originalname}_${Date.now()}`;
  const resultUpload = path.join(avatarsDir, filename);

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(201).json({ avatarURL });
});

const verifyEmail = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) throw httpError(404, "User not found");
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({ message: "Verification successful" });
});

const resendVerifyEmail = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw httpError(401, "Email not found");
  if (user.verify) throw httpError(400, "Verification has already been passed");
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
});

module.exports = {
  getCurrent,
  login,
  logout,
  register,
  updateSubscriptionUser,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
