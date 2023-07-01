const { isValidObjectId } = require("mongoose");

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

module.exports = {
  isValidId,
  validateBody,
};
