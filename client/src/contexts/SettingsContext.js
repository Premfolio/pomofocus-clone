import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    timer: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakInterval: 4,
      autoStartBreaks: false,
      autoStartPomodoros: false
    },
    task: {
      autoCheckTasks: false,
      autoSwitchTasks: true
    },
    sound: {
      alarmSound: 'Wood',
      alarmVolume: 50,
      alarmRepeat: 1,
      tickingSound: 'None'
    },
    theme: 'red',
    notifications: {
      enabled: true,
      browserNotifications: true
    }
  });
  const [loading, setLoading] = useState(true);

  // Load settings from server
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Failed to load settings:', error);
        // Use default settings if loading fails
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Update settings
  const updateSettings = async (newSettings) => {
    try {
      const response = await axios.put('/api/settings', newSettings);
      setSettings(response.data);
      toast.success('Settings updated successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update settings';
      toast.error(message);
      return false;
    }
  };

  // Reset settings to default
  const resetSettings = async () => {
    try {
      const response = await axios.post('/api/settings/reset');
      setSettings(response.data);
      toast.success('Settings reset to default');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset settings';
      toast.error(message);
      return false;
    }
  };

  // Update specific setting
  const updateSetting = async (path, value) => {
    const newSettings = { ...settings };
    
    // Navigate to nested property
    const keys = path.split('.');
    let current = newSettings;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;

    return await updateSettings(newSettings);
  };

  // Get timer duration for specific type
  const getTimerDuration = (type) => {
    return settings.timer[type] || 25;
  };

  // Get theme colors
  const getThemeColors = () => {
    const themeColors = {
      red: {
        primary: 'from-red-900 to-red-800',
        secondary: 'bg-red-800',
        accent: 'bg-red-600'
      },
      blue: {
        primary: 'from-blue-900 to-blue-800',
        secondary: 'bg-blue-800',
        accent: 'bg-blue-600'
      },
      green: {
        primary: 'from-green-900 to-green-800',
        secondary: 'bg-green-800',
        accent: 'bg-green-600'
      },
      purple: {
        primary: 'from-purple-900 to-purple-800',
        secondary: 'bg-purple-800',
        accent: 'bg-purple-600'
      }
    };

    return themeColors[settings.theme] || themeColors.red;
  };

  // Play alarm sound
  const playAlarmSound = () => {
    if (settings.sound.alarmSound === 'None') return;

    // In a real app, you would load and play actual sound files
    // For now, we'll use the browser's built-in audio context
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

      gainNode.gain.setValueAtTime(settings.sound.alarmVolume / 100, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  };

  const value = {
    settings,
    loading,
    updateSettings,
    updateSetting,
    resetSettings,
    getTimerDuration,
    getThemeColors,
    playAlarmSound
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 