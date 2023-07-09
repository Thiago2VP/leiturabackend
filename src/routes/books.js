import { Router } from 'express';
import booksController from '../controllers/Books.js';

const router = new Router();

router.get('/', booksController.index);
router.get('/:id', booksController.show);
router.post('/', booksController.store);
router.put('/:id', booksController.update);
router.delete('/:id', booksController.delete);

export default router;
