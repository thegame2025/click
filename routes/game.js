const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Setting = require('../models/Setting');
const authRoutes = require('./auth');

// Game page - GET
router.get('/', authRoutes.isAuthenticated, async (req, res) => {
  try {
    // Get current user
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/auth');
    }
    
    // Get goal from settings
    let goalSetting = await Setting.findOne({ key: 'goal' });
    
    // If goal doesn't exist, create it with default value
    if (!goalSetting) {
      goalSetting = new Setting({
        key: 'goal',
        value: 100 // Default goal value
      });
      await goalSetting.save();
    }
    
    // Render game page
    res.render('game', {
      user: user,
      goal: goalSetting.value
    });
  } catch (error) {
    console.error('Game page error:', error);
    res.redirect('/auth');
  }
});

// Click button - POST
router.post('/click', authRoutes.isAuthenticated, async (req, res) => {
  try {
    // Update user count
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $inc: { count: 1 } }, // Increment count by 1
      { new: true } // Return updated document
    );
    
    if (!user) {
      req.session.destroy();
      return res.redirect('/auth');
    }
    
    // Redirect back to game page
    res.redirect('/game');
  } catch (error) {
    console.error('Click error:', error);
    res.redirect('/game');
  }
});

// Next level placeholder - only accessible if goal is reached
router.get('/nextlevel', authRoutes.isAuthenticated, async (req, res) => {
  try {
    // Get current user
    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.destroy();
      return res.redirect('/auth');
    }
    
    // Get goal from settings
    const goalSetting = await Setting.findOne({ key: 'goal' });
    if (!goalSetting) {
      return res.redirect('/game');
    }
    
    // Check if user has reached the goal
    if (user.count < goalSetting.value) {
      return res.redirect('/game');
    }
    
    // User has reached the goal, show next level
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>The Game</title>
      <link rel="stylesheet" href="/css/style.css">
    </head>
    <body>
      <div class="container">
        <h1>The Game</h1>
        <p>Congratulations!</p>
      </div>
    </body>
    </html>
  `);
  } catch (error) {
    console.error('Next level error:', error);
    res.redirect('/game');
  }
});

module.exports = router; 