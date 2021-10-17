'use strict';

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user.model.db');
const { generateJST } = require('../helpers/generate-jwt');

const login = async (req = request, res = response) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });
    // Check if user exist <- Ya lo hice en el route

    // Check if user is active on DB
    if (!user.state)
      return res.status(400).json({ msg: "User doesn't exist!" });

    // Chek password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).json({ msg: 'Password is not correct!' });

    // Generate JWT
    const token = await generateJST(user._id);

    res.json({
      msg: 'Login ok',
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Something went wrong!' });
  }
};

module.exports = {
  login,
};
