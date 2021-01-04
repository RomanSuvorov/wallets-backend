const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../middleware');

// server
router.get('/server/checkServer', require('./server/check'));

// auth
router.post(
  '/auth/login',
  [
    check('username', 'Ошибка данных username').exists().isLength({ min: 2 }),
    check('id', 'Ошибка данных username').exists(),
  ],
  require('./auth/login'),
);
router.post(
  '/auth/register',
  [
    check('username', 'Ошибка данных username').exists().isLength({ min: 2 }),
    check('id', 'Ошибка данных username').exists(),
  ],
  require('./auth/register'),
);

// user
router.get('/user/info', auth, require('./user/info'));

// wallet
router.get('/wallet/list', auth, require('./wallet/list'));
router.get('/wallet/find/:address', auth, require('./wallet/find'));
router.post('/wallet/create', auth, require('./wallet/create'));
router.put('/wallet/activate/:id', auth, require('./wallet/activate'));
router.put('/wallet/update', auth, require('./wallet/update'));
router.delete('/wallet/delete', auth, require('./wallet/delete'));

module.exports = router;
