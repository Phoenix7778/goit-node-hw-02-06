const { Schema, model } = require("mongoose");
const Joi = require("joi");

const emailRegExp =
  /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/;
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s]).{6,}/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Set password for user"],
      match: passwordRegExp,
      minLength: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: emailRegExp,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: "",
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const handleMongooseError = (error, data, next) => {
  const status =
    error.name === "MongoServerError" && error.code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

userSchema.post("save", handleMongooseError);

const userValidationSchema = Joi.object({
  password: Joi.string().required().pattern(passwordRegExp).min(6),
  email: Joi.string().required().pattern(emailRegExp),
});

const verifySchema = Joi.object({
  email: Joi.string().required().pattern(emailRegExp).messages({
    "any.required": "missing required field email",
  }),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .required()
    .valid("starter", "pro", "business")
    .message("Subscription must be one of [starter, pro, business]"),
});

const User = model("user", userSchema);

module.exports = {
  User,
  userValidationSchema,
  verifySchema,
  updateSubscriptionSchema,
};
