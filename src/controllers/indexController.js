const getIndex = (req, res) => {
  res.render('index', { title: 'File Manager', user: req.user });
}

const getUpload = (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }
  res.render('uploadform', { title: 'Upload a file', user: req.user });
}

const postUpload = (req, res) => {
  console.log(req.file);
  res.send('File upload successfully');
}

module.exports = { getIndex, getUpload, postUpload };