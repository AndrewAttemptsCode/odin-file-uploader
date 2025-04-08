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

  if (userId !== folder.userId) {
    return res.status(403).send('You do not have permission to access this folder.');
  }

  if (!folder) {
    return res.status(404).send('Folder not found.');
  }

  console.log(folder);
  // format the date and time for display
  res.render('folder-contents', { title: folder.name, files: folder.files, folderId: folder.id, user })
})

const updateFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { folderName } = req.body;
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