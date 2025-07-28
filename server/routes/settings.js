const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user settings
router.get('/', auth, async (req, res) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });
    
    if (!settings) {
      // Create default settings if none exist
      settings = new Settings({ user: req.user._id });
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user settings
router.put('/', auth, [
  body('timer.pomodoro').optional().isInt({ min: 1, max: 120 }),
  body('timer.shortBreak').optional().isInt({ min: 1, max: 30 }),
  body('timer.longBreak').optional().isInt({ min: 1, max: 60 }),
  body('timer.longBreakInterval').optional().isInt({ min: 1, max: 10 }),
  body('timer.autoStartBreaks').optional().isBoolean(),
  body('timer.autoStartPomodoros').optional().isBoolean(),
  body('task.autoCheckTasks').optional().isBoolean(),
  body('task.autoSwitchTasks').optional().isBoolean(),
  body('sound.alarmSound').optional().isIn(['Wood', 'Digital', 'Bell', 'Chime', 'None']),
  body('sound.alarmVolume').optional().isInt({ min: 0, max: 100 }),
  body('sound.alarmRepeat').optional().isInt({ min: 1, max: 10 }),
  body('sound.tickingSound').optional().isIn(['None', 'Clock', 'Metronome']),
  body('theme').optional().isIn(['red', 'blue', 'green', 'purple']),
  body('notifications.enabled').optional().isBoolean(),
  body('notifications.browserNotifications').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let settings = await Settings.findOne({ user: req.user._id });
    
    if (!settings) {
      settings = new Settings({ user: req.user._id });
    }

    // Update settings with provided values
    const updateFields = req.body;
    
    if (updateFields.timer) {
      Object.assign(settings.timer, updateFields.timer);
    }
    
    if (updateFields.task) {
      Object.assign(settings.task, updateFields.task);
    }
    
    if (updateFields.sound) {
      Object.assign(settings.sound, updateFields.sound);
    }
    
    if (updateFields.theme) {
      settings.theme = updateFields.theme;
    }
    
    if (updateFields.notifications) {
      Object.assign(settings.notifications, updateFields.notifications);
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset settings to default
router.post('/reset', auth, async (req, res) => {
  try {
    await Settings.findOneAndDelete({ user: req.user._id });
    
    const settings = new Settings({ user: req.user._id });
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 