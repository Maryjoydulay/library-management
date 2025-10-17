const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  loanedAt: {
    type: Date,
    default: Date.now
  },
  dueAt: {
    type: Date,
    required: true,
    default: function() {
      // Default due date is 14 days from loan date
      return new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    }
  },
  returnedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
loanSchema.index({ memberId: 1, bookId: 1 });
loanSchema.index({ status: 1 });

module.exports = mongoose.model('Loan', loanSchema);
