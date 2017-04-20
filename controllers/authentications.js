module.exports = {
  register: authenticationsRegister,
  login: authenticationsLogin,
  verifyToken: verifyToken
};

const User           = require('../models/user');
const config         = require('../config/config');
const jwt            = require('jsonwebtoken');         // used to create, sign, and verify tokens
//const expressjwt     = require('express-jwt');

function authenticationsRegister(req, res){
  User.create(req.body.user, (err, user) => {
    if (err) return res.status(500).json({success: false, message: `Something went wrong: ${err.message}` });
    if (!user) return res.status(500).json({success: false, message: 'No user has been created' });
    const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 60 * 60} );
    return res.status(201).json({success: true, message: `Welcome ${user.username}!`, user, token});
  });
}

function authenticationsLogin(req, res){
  User.findOne({ email: req.body.user.email }, (err, user) => {
    if (err) return res.status(500).json({success: false, message: `Something went wrong: ${err.message}` });
    if (!user) return res.status(301).json({success: false, message: 'No user was found' });

    if(!user.validatePassword(req.body.user.password)) {
      return res.status(401).json({success: false, message: 'Unauthorized.' });
    }

    const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 60 * 60} );
    return res.status(200).json({success: true, message: 'Welcome back.', user, token});
  });
}

function verifyToken(req, res, next){
  let token = '';

  if (req.headers && req.headers['authorization'] && req.headers['authorization'].split(' ').length === 2){
    token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, config.secret, (err, decoded) => {
      if(err) return res.status(403).json({success: false, message: 'Access denied'}); //FORBIDEN ACCESS

      User.findById(decoded.id, (err, user) => {
        if (err) return res.status(500).json({success: false, message: 'Something went wrong.' });
        if (!user) return res.status(401).json({success: false, message: 'Unauthorized.' });
        req.decoded = decoded;// decoded = {id: user._id}, config.secret, {expiresIn: 60 * 60}
        return next();
      });
    });
  } else{
    return next();
  }
}
