const joi = require("joi");

const contactSchema = joi.object({
  name: joi.string().min(3),
  email: joi.string().email(),
  phone: joi.string().min(5),
});

const contactValidator = (body) => contactSchema.validate(body);

module.exports = { contactValidator };
