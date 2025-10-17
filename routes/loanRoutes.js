const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

// Loan routes
router.get('/loans', loanController.getLoans);
router.get('/loans/overdue', loanController.getOverdueLoans);
router.get('/loans/stats', loanController.getLoanStats);
router.get('/loans/:id', loanController.getLoan);
router.post('/loans', loanController.createLoan);
router.put('/loans/:id/return', loanController.returnBook);
router.put('/loans/:id/extend', loanController.extendLoan);
router.delete('/loans/:id', loanController.deleteLoan);

module.exports = router;
