const router  = require('express').Router();
const users    = require('../controllers/users');
const authentications   = require('../controllers/authentications');

//this middleware verifies the token
router.use(authentications.verifyToken);

//auth routes
router.route('/login')
  .post(authentications.login);
router.route('/register')
  .post(authentications.register);

//users routes
router.route('/users')
  .get(users.index)
  .post(users.create);
router.route('/users/:id')
  .get(users.show)
  .put(users.update)
  .delete(users.delete);

module.exports = router;
