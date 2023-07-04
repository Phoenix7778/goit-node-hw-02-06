const bcrypt = require("bcrypt");

const createHashPassword = (password) => {
  const salt = 10;
  const result = bcrypt.hashSync(password, salt);
  return result;
};

module.exports = createHashPassword;
