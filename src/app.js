import dotenv from 'dotenv';
import express from 'express';

import homeRoutes from './routes/home.js';
import booksRoutes from './routes/books.js';

dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  
  middlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  
  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/books', booksRoutes);
  }
}

export default new App().app;
