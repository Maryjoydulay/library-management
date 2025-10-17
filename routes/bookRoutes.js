const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Book routes
router.get('/books', bookController.getBooks);
router.get('/books/search', bookController.searchBooks);
router.get('/books/isbn/:isbn', bookController.getBookByISBN);
router.get('/books/:id', bookController.getBook);
router.post('/books', bookController.createBook);
router.put('/books/:id', bookController.updateBook);
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;
