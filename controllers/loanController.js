const Loan = require('../models/loanModel');
const Book = require('../models/bookModel');
const Member = require('../models/memberModel');

// Get all loans
const getLoans = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    
    if (status) {
      filter.status = status;
    }

    const loans = await Loan.find(filter)
      .populate('memberId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ loanedAt: -1 });

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single loan by ID
const getLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('memberId', 'name email')
      .populate('bookId', 'title author isbn');

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new loan (borrow a book)
const createLoan = async (req, res) => {
  try {
    const { memberId, bookId, dueAt } = req.body;
    
    // Validate required fields
    if (!memberId || !bookId) {
      return res.status(400).json({
        success: false,
        message: 'Member ID and Book ID are required'
      });
    }

    // Check if member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book has available copies
    const activeLoans = await Loan.countDocuments({ 
      bookId, 
      status: 'active' 
    });

    if (activeLoans >= book.copies) {
      return res.status(400).json({
        success: false,
        message: 'No copies available for loan'
      });
    }

    // Check if member already has this book on loan
    const existingLoan = await Loan.findOne({ 
      memberId, 
      bookId, 
      status: 'active' 
    });

    if (existingLoan) {
      return res.status(400).json({
        success: false,
        message: 'Member already has this book on loan'
      });
    }

    // Create loan
    const loan = new Loan({
      memberId,
      bookId,
      dueAt: dueAt ? new Date(dueAt) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Default 14 days
    });

    await loan.save();
    
    // Populate the loan data for response
    await loan.populate('memberId', 'name email');
    await loan.populate('bookId', 'title author isbn');

    res.status(201).json({
      success: true,
      message: 'Book loaned successfully',
      data: loan
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Return a book (update loan status)
const returnBook = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status === 'returned') {
      return res.status(400).json({
        success: false,
        message: 'Book already returned'
      });
    }

    // Update loan status
    loan.returnedAt = new Date();
    loan.status = 'returned';
    await loan.save();

    // Populate the loan data for response
    await loan.populate('memberId', 'name email');
    await loan.populate('bookId', 'title author isbn');

    res.status(200).json({
      success: true,
      message: 'Book returned successfully',
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Extend loan (update due date)
const extendLoan = async (req, res) => {
  try {
    const { days } = req.body;
    const loan = await Loan.findById(req.params.id);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }

    if (loan.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Can only extend active loans'
      });
    }

    // Extend due date by specified days (default 7 days)
    const extensionDays = days || 7;
    loan.dueAt = new Date(loan.dueAt.getTime() + extensionDays * 24 * 60 * 60 * 1000);
    await loan.save();

    // Populate the loan data for response
    await loan.populate('memberId', 'name email');
    await loan.populate('bookId', 'title author isbn');

    res.status(200).json({
      success: true,
      message: `Loan extended by ${extensionDays} days`,
      data: loan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a loan (admin only - for data cleanup)
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Loan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get overdue loans
const getOverdueLoans = async (req, res) => {
  try {
    const overdueLoans = await Loan.find({
      status: 'active',
      dueAt: { $lt: new Date() }
    })
      .populate('memberId', 'name email')
      .populate('bookId', 'title author isbn')
      .sort({ dueAt: 1 });

    // Update status to overdue for loans that are past due date
    for (const loan of overdueLoans) {
      if (loan.status === 'active') {
        loan.status = 'overdue';
        await loan.save();
      }
    }

    res.status(200).json({
      success: true,
      count: overdueLoans.length,
      data: overdueLoans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get loan statistics
const getLoanStats = async (req, res) => {
  try {
    const totalLoans = await Loan.countDocuments();
    const activeLoans = await Loan.countDocuments({ status: 'active' });
    const returnedLoans = await Loan.countDocuments({ status: 'returned' });
    const overdueLoans = await Loan.countDocuments({ 
      status: 'active',
      dueAt: { $lt: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalLoans,
        active: activeLoans,
        returned: returnedLoans,
        overdue: overdueLoans
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getLoans,
  getLoan,
  createLoan,
  returnBook,
  extendLoan,
  deleteLoan,
  getOverdueLoans,
  getLoanStats
};
