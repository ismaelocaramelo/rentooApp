const router  = require('express').Router();
const users    = require('../controllers/users');
const authentications   = require('../controllers/authentications');
const path = require('path');
//this middleware verifies the token
router.use(authentications.verifyToken);

router.route('/')
  .get( (req, res) => res.sendFile(path.join(__dirname, '../index.html')));

//auth routes
router.route('/login')
  .post(authentications.login);
router.route('/register')
  .post(authentications.register);

//users routes
router.route('/users/token') // to get the user id back once we get the token.
  .get(users.getUser);
router.route('/users')
  .get(users.index)
  .post(users.create);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);
router.route('/users/newpassword/:id')
  .put(users.updatePassword)


module.exports = router;
