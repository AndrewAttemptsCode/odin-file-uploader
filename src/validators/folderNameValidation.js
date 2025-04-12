const { body } = require('express-validator');

const folderNameValidation = [
  body('folderName')
    .trim()
    .notEmpty().withMessage('Folder name is empty.')
    .isLength({ max: 20 }).withMessage('Folder name exceeds maximum character length of 20')
];

module.exports = folderNameValidation;