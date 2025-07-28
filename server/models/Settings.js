const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  timer: {
    pomodoro: {
      type: Number,
      default: 25,
      min: 1,
      max: 120
    },
    shortBreak: {
      type: Number,
      default: 5,
      min: 1,
      max: 30
    },
    longBreak: {
      type: Number,
      default: 15,
      min: 1,
      max: 60
    },
    longBreakInterval: {
      type: Number,
      default: 4,
      min: 1,
      max: 10
    },
    autoStartBreaks: {
      type: Boolean,
      default: false
    },
    autoStartPomodoros: {
      type: Boolean,
      default: false
    }
  },
  task: {
    autoCheckTasks: {
      type: Boolean,
      default: false
    },
    autoSwitchTasks: {
      type: Boolean,
      default: true
    }
  },
  sound: {
    alarmSound: {
      type: String,
      enum: ['Wood', 'Digital', 'Bell', 'Chime', 'None'],
      default: 'Wood'
    },
    alarmVolume: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    alarmRepeat: {
      type: Number,
      default: 1,
      min: 1,
      max: 10
    },
    tickingSound: {
      type: String,
      enum: ['None', 'Clock', 'Metronome'],
      default: 'None'
    }
  },
  theme: {
    type: String,
    enum: ['red', 'blue', 'green', 'purple'],
    default: 'red'
  },
  notifications: {
    enabled: {
      type: Boolean,
      default: true
    },
    browserNotifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema); 