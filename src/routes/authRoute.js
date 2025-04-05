const { Router } = require('express');
const authController = require('../controllers/authController');
const registerValidation = require('../validators/registerValidation');

const authRoute = Router();

authRoute.get('/register', authController.getRegister);
authRoute.post('/register', registerValidation, authController.postRegister);

module.exports = authRoute;