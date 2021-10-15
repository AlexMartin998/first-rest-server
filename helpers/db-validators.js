'use strict';

const User = require('../models/user.model.db.js');
const Role = require('../models/role.model.db.js');

const emailExist = async (mail = '') => {
  const emailExist = await User.findOne({ mail });

  if (emailExist) throw new Error(`Mail ${mail} already registered.`);
};

const isRoleValid = async (role = '') => {
  const roleExist = await Role.findOne({ role });
  if (!roleExist) throw new Error(`The role: ${role} is not valid in this app.`);
};

const userIdExist = async id => {
  const userIDExist = await User.findById(id);
  if (!userIDExist) throw new Error(`User ID: ${id} does not exist`);
};

module.exports = {
  isRoleValid,
  emailExist,
  userIdExist,
};
