'use strict';

const express = require('express');
const { PORT } = require('../config');
const cors = require('cors');
const { usersRoutes, authLoginRoutes } = require('../routes');
const { dbConnection } = require('../db/config.db.js');

class Server {
  constructor() {
    this.app = express();
    this.port = PORT;
    this.usersRoutePath = '/api/users';
    this.authPath = '/api/auth';

    // Connect to DB
    this.connectToDB();

    // Middlerares
    this.middlewares();

    // Routes
    this.routes();
  }

  async connectToDB() {
    await dbConnection();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Reading and parsing the body
    this.app.use(express.json());

    // Static directory
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authPath, authLoginRoutes);
    this.app.use(this.usersRoutePath, usersRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}

module.exports = new Server();
