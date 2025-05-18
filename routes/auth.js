const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect('/auth');
};

// Middleware to check if user is NOT authenticated
const isNotAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  res.redirect('/game');
};

// Auth page - GET
router.get('/auth', isNotAuthenticated, (req, res) => {
  res.render('auth', { error: undefined });
});

// Combined Login/Register - POST
router.post('/auth', isNotAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if the username exists
    const existingUser = await User.findOne({ username });
    
    if (existingUser) {
      // User exists - try to login
      const isMatch = await existingUser.comparePassword(password);
      if (!isMatch) {
        return res.render('auth', { error: 'Error' });
      }
      
      // Password matches - login successful
      req.session.userId = existingUser._id;
      return res.redirect('/game');
    } else {
      // User doesn't exist - create a new account
      const newUser = new User({
        username,
        password,
        count: 0
      });
      
      await newUser.save();
      
      // Set session and redirect
      req.session.userId = newUser._id;
      return res.redirect('/game');
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.render('auth', { error: 'Error' });
  }
});

// Export middleware for use in other files
router.isAuthenticated = isAuthenticated;
router.isNotAuthenticated = isNotAuthenticated;

module.exports = router; 