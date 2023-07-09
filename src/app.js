import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import homeRoutes from './routes/home.js';
import booksRoutes from './routes/books.js';

dotenv.config();

const whiteList = [process.env.FRONT_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }
  
  middlewares() {
    this.app.use(cors(corsOptions));
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
  
  routes() {
    this.app.use('/', homeRoutes);
    this.app.use('/books', booksRoutes);
  }
}

export default new App().app;
