const getIndex = (req, res) => {
  res.render('index', { title: 'File Manager', user: req.user });
}

module.exports = { getIndex };