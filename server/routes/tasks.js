const express = require('express');
const { body, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const { completed, project, priority } = req.query;
    const filter = { user: req.user._id };

    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    if (project) {
      filter.project = project;
    }
    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new task
router.post('/', auth, [
  body('title').notEmpty().withMessage('Task title is required'),
  body('description').optional(),
  body('project').optional(),
  body('estimatedPomodoros').optional().isInt({ min: 1, max: 10 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, project, estimatedPomodoros, priority, dueDate } = req.body;

    const task = new Task({
      user: req.user._id,
      title,
      description,
      project: project || 'No Project',
      estimatedPomodoros: estimatedPomodoros || 1,
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task
router.put('/:id', auth, [
  body('title').optional().notEmpty().withMessage('Task title cannot be empty'),
  body('description').optional(),
  body('project').optional(),
  body('estimatedPomodoros').optional().isInt({ min: 1, max: 10 }),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const updateFields = req.body;
    if (updateFields.dueDate) {
      updateFields.dueDate = new Date(updateFields.dueDate);
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle task completion
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update completed pomodoros
router.patch('/:id/pomodoros', auth, [
  body('completedPomodoros').isInt({ min: 0 }).withMessage('Completed pomodoros must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completedPomodoros = req.body.completedPomodoros;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error('Update pomodoros error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $match: { user: req.user._id } },
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

    const projectStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$project',
          count: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      overall: stats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        totalPomodoros: 0,
        completedPomodoros: 0
      },
      projects: projectStats
    });
  } catch (error) {
    console.error('Task stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 