const router = require('express').Router();
const { check } = require('express-validator');
const { login } = require('../controllers/auth.controller.js');
const { emailExist } = require('../helpers/auth.js');

const {
  validateFields,
} = require('../middlewares/validate-fields.middleware.js');

router.post(
  '/login',
  [
    check('mail', 'Email is required!').not().isEmpty(),
    check('mail', 'Email not valid!').isEmail(),
    check('mail').custom(emailExist),
    check('password', 'Password is required!').not().isEmpty(),
    validateFields,
  ],
  login
);

module.exports = router;
