'use strict';

const express = require('express');
const { PORT } = require('../config');
const cors = require('cors');
const {
  usersRoutes,
  authLoginRoutes,
  categoriesRouter,
  productsRouter,
  searchRouter,
} = require('../routes');
const { dbConnection } = require('../db/config.db.js');

class Server {
  constructor() {
    this.app = express();
    this.port = PORT;

    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      users: '/api/users',
      products: '/api/products',
      search: '/api/search',
    };

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
    this.app.use(this.paths.auth, authLoginRoutes);
    this.app.use(this.paths.users, usersRoutes);
    this.app.use(this.paths.categories, categoriesRouter);
    this.app.use(this.paths.products, productsRouter);
    this.app.use(this.paths.search, searchRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}

module.exports = new Server();
