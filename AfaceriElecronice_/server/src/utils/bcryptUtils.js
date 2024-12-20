const bcrypt = require("bcrypt");
const salt = process.env.BCRYPT_SALT;

/**
 * Hashes a password
 * @param {string} password
 * @returns {string} hashed password
 */
const hashPassword = password => {
  if (!salt) {
    throw new Error("BCRYPT_SALT is not defined");
  }

  const numberSalt = parseInt(salt);

  return bcrypt.hashSync(password, numberSalt);
};

const comparePassword = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
