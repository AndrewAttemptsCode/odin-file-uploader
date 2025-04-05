const { body } = require("express-validator");
const prisma = require("../../config/prisma");

const registerValidation = [
  body("username")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Username field is empty.")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Letters and numbers only.")
    .isLength({ min: 4 })
    .withMessage("Minimum 4 characters long")
    .custom(async (value) => {
      const username = await prisma.user.findUnique({
        where: { username: value },
      });
      if (username) {
        throw new Error("Username already exists.");
      }
      return true;
    }),
  body("email")
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage("Email field is empty.")
    .isEmail()
    .withMessage("Incorrect email format.")
    .custom(async (value) => {
      const email = await prisma.user.findUnique({
        where: { email: value },
      });
      if (email) {
        throw new Error("Email already in use.");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password field is empty.")
    .isLength({ min: 6 })
    .withMessage("Password minimum length of 6 characters."),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Passwords do not match.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match.")
      }
      return true;
    })
];

module.exports = registerValidation;
