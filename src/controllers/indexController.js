const { validationResult } = require('express-validator');
const prisma = require('../../config/prisma');
const asyncHandler = require('express-async-handler');

const getIndex = (req, res) => {
  res.render('index', { title: 'File Manager', user: req.user });
}

const getUpload = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.redirect('/auth/login');
  }
  const folders = await prisma.folder.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  })
  res.render('uploadform', { title: 'Upload a file', user, folders });
})

const postUpload = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { originalname, path, size } = req.file;
  await prisma.file.create({
    data: {
      name: originalname,
      filePath: path,
      fileSize: size,
      folder: {
        connect: { id: Number(folderId) },
      },
    },
  });
  console.log(req.file);
  res.redirect(`/folder/${folderId}`);
})

const postFolder = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;
  await prisma.folder.create({
    data: {
      name,
      user: {
        connect: { id: userId },
      },
    },
  });
  res.redirect('/upload');
})

const getFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const user = req.user;
  const userId = user.id;

  const folder = await prisma.folder.findUnique({
    where: { id: Number(folderId) },
    include: {
      files: true,
    },
  });

  if (!folder) {
    return res.status(404).send('Folder not found.');
  }
  
  if (userId !== folder.userId) {
    return res.status(403).send('You do not have permission to access this folder.');
  }

  folder.files = folder.files.map((file) => {
    const dateTimeObj = new Date(file.createdAt);
    const date = String(dateTimeObj.getDate()).padStart(2, '0');
    const month = String(dateTimeObj.getMonth() + 1).padStart(2, '0');
    const year = String(dateTimeObj.getFullYear()).slice(-2);

    const hours = String(dateTimeObj.getHours()).padStart(2, '0');
    const minutes = String(dateTimeObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateTimeObj.getSeconds()).padStart(2, '0');

    return {
      ...file,
      dateFormatted: `${date}/${month}/${year}`,
      timeFormatted: `${hours}:${minutes}:${seconds}`
    };
  });

  res.render('folder-contents', { title: folder.name, files: folder.files, folderId: folder.id, user })
})

const updateFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const folder = await prisma.folder.findUnique({
      where: { id: Number(folderId) },
      include: {
        files: true,
      },
    });

    if (!folder) {
      return res.status(404).send('Folder not found.');
    }

    const user = req.user;
    const userId = user.id;
    
    if (userId !== folder.userId) {
      return res.status(403).send('You do not have permission to access this folder.');
    }

    folder.files = folder.files.map((file) => {
      const dateTimeObj = new Date(file.createdAt);
      const date = String(dateTimeObj.getDate()).padStart(2, '0');
      const month = String(dateTimeObj.getMonth() + 1).padStart(2, '0');
      const year = String(dateTimeObj.getFullYear()).slice(-2);
  
      const hours = String(dateTimeObj.getHours()).padStart(2, '0');
      const minutes = String(dateTimeObj.getMinutes()).padStart(2, '0');
      const seconds = String(dateTimeObj.getSeconds()).padStart(2, '0');
  
      return {
        ...file,
        dateFormatted: `${date}/${month}/${year}`,
        timeFormatted: `${hours}:${minutes}:${seconds}`
      };
    });

    const allErrors = errors.array();
    const editFolderNameError = allErrors[0]?.msg;
    
    return res.status(400).render('folder-contents', {
      title: folder.name,
      editFolderNameError,
      files: folder.files,
      folderId: folder.id,
      user,
      showEditFolder: 'true'
    })
  }

  await prisma.folder.update({
    where: { id: Number(folderId) },
    data: {
      name: folderName,
    },
  });
  res.redirect(`/folder/${folderId}`);
})

const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  await prisma.folder.delete({
    where: { id: Number(folderId) },
  });
  res.redirect('/upload');
})

const downloadFile = asyncHandler(async (req, res) => {
  const { fileId, folderId } = req.params;
  const user = req.user;

  if (!user) {
    return res.redirect('/auth/login');
  }

  const userId = user.id;

  const fileOwner = await prisma.folder.findUnique({
    where: { id: Number(folderId) },
  });

  if (userId !== fileOwner.userId) {
    return res.status(403).send('You do not have permission to download this file.');
  }

  const file = await prisma.file.findFirst({
    where: { id: Number(fileId) },
  });

  res.download(file.filePath, file.name, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(500).send('File could not be downloaded.');
    }
  });  
})

module.exports = { getIndex, getUpload, postUpload, postFolder, getFolder, updateFolder, deleteFolder, downloadFile };