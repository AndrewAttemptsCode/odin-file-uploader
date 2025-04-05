const prisma = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");

const getRegister = (req, res) => {
  res.render("registerform", { title: "Register an Account" });
};

const postRegister = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const allErrors = errors.array();
    const usernameError = allErrors?.find((error) => error.path === "username")?.msg;
    const emailError = allErrors?.find((error) => error.path === "email")?.msg;
    const passwordError = allErrors?.find((error) => error.path === "password")?.msg;
    const confirmPasswordError = allErrors?.find((error) => error.path === 'confirmPassword')?.msg;
    
    return res.status(400).render("registerform", {
      title: "Register an Account",
      email,
      username,
      password,
      usernameError,
      emailError,
      passwordError,
      confirmPasswordError,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
    },
  });

  res.redirect('/auth/login');

});

const getLogin = (req, res) => {
  console.log(req.session);
  const allErrors = req.flash('error');
  const errorMessage = allErrors[allErrors.length - 1];
  res.render('loginform', { title: 'Log In', errorMessage })
}

module.exports = { getRegister, postRegister, getLogin };
