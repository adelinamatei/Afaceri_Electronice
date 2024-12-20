const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Function to generate a JWT
 * @param {string} id - The user ID to include in the token
 * @returns {string} - The generated JWT
 * @throws {Error} - If JWT_SECRET is not defined
 */
const generateToken = id => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1h",
  });
};

/**
 * Middleware to verify a JWT
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next middleware function
 */
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  const token = bearerHeader?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized - No valid token",
      data: {},
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
        data: {},
      });
    }

    req.userId = decoded.id;

    next();
  });
};

/**
 * Function to verify a JWT and return true or false
 * @param {string} token - The JWT to verify
 * @returns {boolean} - True if the token is valid, false otherwise
 */
const isValidToken = token => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
};

module.exports = { verifyToken, generateToken, isValidToken };
