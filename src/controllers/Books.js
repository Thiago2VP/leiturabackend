import { resolve } from 'node:path';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import dotenv from 'dotenv';

dotenv.config();

const file = resolve('db.json');
const adapter = new JSONFile(file);
const defaultData = { books: [] };
const db = new Low(adapter, defaultData);

class BooksController {
  async store(req, res) {
    try {
      await db.read();
      const books = db.data.books;
      for (let book of books) {
        if (book.name === req.body.name) return res.status(401).json({
          errors: ['Livro já cadastrado']
        })
      }
      const newBook = {
        id: Date.now().toString(),
        name: req.body.name,
        cover: req.body.cover,
        url: req.body.shortLink,
        charpter: req.body.charpter
      };
      db.data.books.push(newBook);
      db.write();
      const { id, name, charpter } = newBook;
      return res.status(201).json({ id, name, charpter });
    } catch (e) {
      return res.status(400).json({
        errors: ['Dado não pôde ser guardado'],
      });
    }
  }

  async index(req, res) {
    try {
      await db.read();
      const books = db.data.books;
      const validBooks = (
        books
        .filter((book) => book.name !== null)
      );
      return res.status(200).json(validBooks);
    } catch (e) {
      return res.status(400).json({
        errors: ['Dado não pôde ser encontrado'],
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      await db.read();
      const books = db.data.books;
      let book = null;
      for (let bookI of books) {
        if (bookI.id === id) book = bookI;
      }
      if (!book) {
        return res.status(400).json({
          errors: ['Livro não existe'],
        });
      }
      return res.status(200).json(book);
    } catch (e) {
      return res.status(400).json({
        errors: ['Dado não pôde ser encontrado'],
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      await db.read();
      const books = db.data.books;
      let book = null;
      for (let bookI of books) {
        if (bookI.id === id) book = bookI;
      }
      if (!book) return res.status(400).json({ errors: ["Livro não existe"] });
      book.charpter = req.body.charpter;
      db.write();
      const { name, charpter } = book;
      return res.status(200).json({ name, charpter });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      await db.read();
      const books = db.data.books;
      for (let bookI of books) {
        if (bookI.id === id) {
          const bookDeleted = {
            id: bookI.id,
            name: bookI.name,
            cover: bookI.cover,
            url: bookI.url,
            charpter: bookI.charpter
          };
          bookI.name = null;
          bookI.cover = null;
          bookI.url = null;
          bookI.charpter = null;

          db.write();
          return res.status(200).json(bookDeleted);
        }
      }

      return res.status(400).json({
        errors: ['Livro não existe'],
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new BooksController();
