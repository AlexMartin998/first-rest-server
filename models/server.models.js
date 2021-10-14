'use strict';

const express = require('express');
const { PORT } = require('../config');
const cors = require('cors');
const { usersRoutes } = require('../routes');

class Server {
  constructor() {
    this.app = express();
    this.port = PORT;
    this.usersRoutePath = '/api/users';

    // Middlerares
    this.middlewares();

    // Routes
    this.routes();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Read and parse of body
    this.app.use(express.json());

    // Static directory
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.usersRoutePath, usersRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}

module.exports = new Server();
