'use strict';

const jwt = require('jsonwebtoken');
const { SECRETORPRIVATEKEY } = require('../config');

const generateJST = (uid = '') => {
  return new Promise((resolve, reject) => {
    const payload = { uid };

    jwt.sign(payload, SECRETORPRIVATEKEY, { expiresIn: '4h' }, (err, token) => {
      if (err) {
        console.log(err);
        reject('Sorry, the JWT could not be generated');
      } else resolve(token);
    });
  });
};

module.exports = {
  generateJST,
};
