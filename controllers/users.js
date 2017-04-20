module.exports = {
  index: usersIndex,
  create: usersCreate,
  show: usersShow,
  update: usersUpdate,
  delete: usersDelete
};

const User = require('../models/user');

function usersIndex(req, res){
  User.find({}, (err, users) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(users);
  });
}

function usersCreate(req, res){
  User.create(req.body.user, (err, user) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json(user);
  });
}

function usersShow(req, res){
  const id = req.params.id;

  User.findById(id, (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(404).json({ error: 'No user was found.' });
    return res.status(200).json(user);
  });
}

function usersUpdate(req, res){
  const id = req.params.id;

  User.findByIdAndUpdate({ _id: id }, req.body.user, (err, user) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(404).json({ error: 'No user was found.' });
    return res.status(200).json(user);
  });
}

function usersDelete(req, res){
  const id = req.params.id;

  User.findByIdAndRemove({ _id: id }, err => {
    if (err) return res.status(500).json(err);
    return res.sendStatus(200);
  });
}
