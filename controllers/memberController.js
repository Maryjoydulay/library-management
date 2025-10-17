const Member = require('../models/memberModel');
const Loan = require('../models/loanModel');

// Get all members
const getMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ joinedAt: -1 });
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single member by ID
const getMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member by email
const getMemberByEmail = async (req, res) => {
  try {
    const member = await Member.findOne({ email: req.params.email });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new member
const createMember = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if member with same email already exists
    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Member with this email already exists'
      });
    }

    const member = new Member({
      name,
      email,
      joinedAt: new Date()
    });

    await member.save();
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: member
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Update a member
const updateMember = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if email is being changed and if new email already exists
    if (email && email !== member.email) {
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        return res.status(400).json({
          success: false,
          message: 'Member with this email already exists'
        });
      }
    }

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Member updated successfully',
      data: updatedMember
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a member
const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    // Check if member has active loans
    const activeLoans = await Loan.find({ 
      memberId: req.params.id, 
      status: 'active' 
    });

    if (activeLoans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete member with active loans. Please return all books first.'
      });
    }

    await Member.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Member deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get member's loan history
const getMemberLoans = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const loans = await Loan.find({ memberId: req.params.id })
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

// Get member's active loans
const getMemberActiveLoans = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    const activeLoans = await Loan.find({ 
      memberId: req.params.id, 
      status: 'active' 
    }).populate('bookId', 'title author isbn');

    res.status(200).json({
      success: true,
      count: activeLoans.length,
      data: activeLoans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Search members
const searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const members = await Member.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).sort({ joinedAt: -1 });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getMembers,
  getMember,
  getMemberByEmail,
  createMember,
  updateMember,
  deleteMember,
  getMemberLoans,
  getMemberActiveLoans,
  searchMembers
};
