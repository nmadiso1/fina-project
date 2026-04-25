const authService = require('../services/authService');

/**
 * POST /api/auth/signup
 * Creates a new user account.
 */
const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authService.signup(email, password);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, login };
