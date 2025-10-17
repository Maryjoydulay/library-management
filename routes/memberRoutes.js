const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Member routes
router.get('/members', memberController.getMembers);
router.get('/members/search', memberController.searchMembers);
router.get('/members/email/:email', memberController.getMemberByEmail);
router.get('/members/:id', memberController.getMember);
router.get('/members/:id/loans', memberController.getMemberLoans);
router.get('/members/:id/active-loans', memberController.getMemberActiveLoans);
router.post('/members', memberController.createMember);
router.put('/members/:id', memberController.updateMember);
router.delete('/members/:id', memberController.deleteMember);

module.exports = router;
