const { isValidObjectId } = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  UserModel: { User },
} = require("../models/user");

const { SECRET_KEY } = process.env;

const httpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const isValidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    throw httpError(400, `${id} is not a valid ID`);
  }
  next();
};

const validateBody = (schema) => (req, res, next) => {
  const { body } = req;
  if (!body || Object.keys(body).length === 0) {
    throw httpError(400, "Missing fields");
  }

  const { error } = schema.validate(body);
  if (error) {
    throw httpError(400, error.details[0].message);
  }
  next();
};

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    next(httpError(401, "Not authorized"));
  }
  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      next(httpError(401, "Not authorized"));
    }
    req.user = user;
    next();
  } catch {
    next(httpError(401, "Not authorized"));
  }
};

module.exports = {
  isValidId,
  validateBody,
  authenticate,
};
