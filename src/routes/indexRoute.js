const { Router } = require('express');
const indexController = require('../controllers/indexController');

const indexRoute = Router();

indexRoute.get('/', indexController.getIndex);

module.exports = indexRoute;