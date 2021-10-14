'use strict';

const { response, request } = require('express');

const getUsers = (req = request, res = response) => {
  const { q, name = 'No name', apikey } = req.query;

  res.json({
    name,
    q,
    msg: 'Read - GET  |  Controller',
    apikey,
  });
};

const postUser = (req, res = response) => {
  const { name, age, os } = req.body;

  return res.status(201).json({
    name,
    age,
    os,
    msg: 'Create - POST  |  Controller',
  });
};

const updateUser = (req = request, res = response) => {
  const id = req.params.id;
  console.log({ id });

  res.json({
    name: 'Alex',
    msg: 'Update - PUT  |  Controller',
  });
};

const deleteUser = (req, res = response) =>
  res.json({
    name: 'Alex',
    msg: 'Delete - DELETE  |  Controller',
  });

module.exports = {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
};
