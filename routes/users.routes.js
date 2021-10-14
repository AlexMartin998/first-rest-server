'use strict';

const {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controller.js');

const router = require('express').Router();

router.post('/', postUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/', deleteUser);

module.exports = router;
