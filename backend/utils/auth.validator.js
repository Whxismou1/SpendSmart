// validators/auth.validators.js
const { body, validationResult } = require("express-validator");

const registerValidationRules = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Email is not valid"),
    body("password")
      .isLength({ min: 1 })
      .withMessage("Password must be at least 12 characters long"),
    body("confirmPassword")
      .isLength({ min: 1 })
      .withMessage("Confirm password is required"),
  ];
};

const loginValidationRules = () => {
  return [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const verifyEmailValidationRules = () => {
  return [
    body("verificationCode")
      .notEmpty()
      .withMessage("Verification code is required"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  verifyEmailValidationRules,
  validate,
};
