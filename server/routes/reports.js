const express = require('express');
const TimerSession = require('../models/TimerSession');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comprehensive report data
router.get('/', auth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    // Get timer statistics
    const timerStats = await TimerSession.aggregate([
      {
        $match: {
          user: req.user._id,
          startTime: { $gte: startDate },
          completed: true
        }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' },
          totalActualDuration: {
            $sum: {
              $divide: [
                { $subtract: ['$endTime', '$startTime'] },
                1000 * 60 // Convert to minutes
              ]
            }
          }
        }
      }
    ]);

    // Get daily focus hours
    const dailyStats = await TimerSession.aggregate([
      {
        $match: {
          user: req.user._id,
          startTime: { $gte: startDate },
          completed: true,
          type: 'pomodoro'
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }
          },
          focusHours: {
            $sum: {
              $divide: [
                { $subtract: ['$endTime', '$startTime'] },
                1000 * 60 * 60 // Convert to hours
              ]
            }
          },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Get task statistics
    const taskStats = await Task.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completedTasks: { $sum: { $cond: ['$completed', 1, 0] } },
          totalPomodoros: { $sum: '$estimatedPomodoros' },
          completedPomodoros: { $sum: '$completedPomodoros' }
        }
      }
    ]);

    // Get project statistics
    const projectStats = await Task.aggregate([
      {
        $match: {
          user: req.user._id,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          totalPomodoros: { $sum: '$estimatedPomodoros' },
          completedPomodoros: { $sum: '$completedPomodoros' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Calculate streak
    const streakData = await TimerSession.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'pomodoro',
          completed: true
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } }
          },
          sessions: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': -1 } },
      { $limit: 30 }
    ]);

    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < streakData.length; i++) {
      const sessionDate = new Date(streakData[i]._id.date);
      const daysDiff = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === currentStreak) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate total focus hours
    const totalFocusHours = timerStats
      .filter(stat => stat._id === 'pomodoro')
      .reduce((sum, stat) => sum + stat.totalActualDuration, 0) / 60;

    // Calculate days accessed
    const daysAccessed = new Set(
      dailyStats.map(day => day._id.date)
    ).size;

    res.json({
      period,
      startDate,
      activitySummary: {
        hoursFocused: Math.round(totalFocusHours * 10) / 10,
        daysAccessed,
        dayStreak: currentStreak
      },
      timerStats,
      dailyStats,
      taskStats: taskStats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        totalPomodoros: 0,
        completedPomodoros: 0
      },
      projectStats
    });
  } catch (error) {
    console.error('Reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed timer sessions
router.get('/detail', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, type } = req.query;
    const filter = { user: req.user._id, completed: true };

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.startTime = {};
      if (startDate) filter.startTime.$gte = new Date(startDate);
      if (endDate) filter.startTime.$lte = new Date(endDate);
    }

    const sessions = await TimerSession.find(filter)
      .sort({ startTime: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('task', 'title project');

    const total = await TimerSession.countDocuments(filter);

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Detail report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get ranking data (for premium users)
router.get('/ranking', auth, async (req, res) => {
  try {
    const { period = 'week' } = req.query;
    let startDate;

    switch (period) {
      case 'week':
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }

    const ranking = await TimerSession.aggregate([
      {
        $match: {
          startTime: { $gte: startDate },
          completed: true,
          type: 'pomodoro'
        }
      },
      {
        $group: {
          _id: '$user',
          totalFocusTime: {
            $sum: {
              $divide: [
                { $subtract: ['$endTime', '$startTime'] },
                1000 * 60 // Convert to minutes
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $project: {
          username: { $arrayElemAt: ['$userInfo.username', 0] },
          totalFocusTime: 1
        }
      },
      { $sort: { totalFocusTime: -1 } },
      { $limit: 50 }
    ]);

    res.json({
      period,
      ranking
    });
  } catch (error) {
    console.error('Ranking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 