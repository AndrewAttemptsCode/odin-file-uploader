const { Router } = require('express');
const indexController = require('../controllers/indexController');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const indexRoute = Router();

indexRoute.get('/', indexController.getIndex);
indexRoute.get('/upload', indexController.getUpload);
indexRoute.post('/upload', upload.single('fileupload'), indexController.postUpload);

module.exports = indexRoute;