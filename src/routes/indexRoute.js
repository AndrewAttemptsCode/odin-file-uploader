const { Router } = require('express');
const indexController = require('../controllers/indexController');
const multer  = require('multer');
const folderNameValidation = require('../validators/folderNameValidation');
const upload = multer({ dest: 'uploads/' });

const indexRoute = Router();

indexRoute.get('/', indexController.getIndex);
indexRoute.get('/upload', indexController.getUpload);
indexRoute.post('/folder/:folderId', upload.single('fileupload'), indexController.postUpload);
indexRoute.post('/create-folder', indexController.postFolder);
indexRoute.get('/folder/:folderId', indexController.getFolder);
indexRoute.post('/folder/:folderId/update-folder', folderNameValidation, indexController.updateFolder);
indexRoute.get('/folder/:folderId/delete-folder', indexController.deleteFolder);
indexRoute.get('/folder/:folderId/:fileId', indexController.downloadFile);

module.exports = indexRoute;