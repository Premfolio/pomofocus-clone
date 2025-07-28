import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Clock, CheckCircle, Volume2, Info } from 'lucide-react';

const Settings = () => {
  const { settings, updateSetting, resetSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('timer');

  const handleSettingChange = async (path, value) => {
    await updateSetting(path, value);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      await resetSettings();
    }
  };

  const tabs = [
    { id: 'timer', label: 'TIMER', icon: Clock },
    { id: 'task', label: 'TASK', icon: CheckCircle },
    { id: 'sound', label: 'SOUND', icon: Volume2 }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">SETTING</h1>
          <button
            onClick={handleReset}
            className="btn-secondary"
          >
            Reset to Default
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'tab-active'
                  : 'tab-inactive'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Timer Settings */}
        {activeTab === 'timer' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Time (minutes)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Pomodoro
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.timer.pomodoro}
                  onChange={(e) => handleSettingChange('timer.pomodoro', parseInt(e.target.value))}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.timer.shortBreak}
                  onChange={(e) => handleSettingChange('timer.shortBreak', parseInt(e.target.value))}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.timer.longBreak}
                  onChange={(e) => handleSettingChange('timer.longBreak', parseInt(e.target.value))}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Long Break Interval
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.timer.longBreakInterval}
                  onChange={(e) => handleSettingChange('timer.longBreakInterval', parseInt(e.target.value))}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white">Auto Start Breaks</span>
                  <Info className="w-4 h-4 text-white text-opacity-50" />
                </div>
                <button
                  onClick={() => handleSettingChange('timer.autoStartBreaks', !settings.timer.autoStartBreaks)}
                  className={`toggle-switch ${settings.timer.autoStartBreaks ? 'active' : ''}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white">Auto Start Pomodoros</span>
                  <Info className="w-4 h-4 text-white text-opacity-50" />
                </div>
                <button
                  onClick={() => handleSettingChange('timer.autoStartPomodoros', !settings.timer.autoStartPomodoros)}
                  className={`toggle-switch ${settings.timer.autoStartPomodoros ? 'active' : ''}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Task Settings */}
        {activeTab === 'task' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Task Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white">Auto Check Tasks</span>
                  <Info className="w-4 h-4 text-white text-opacity-50" />
                </div>
                <button
                  onClick={() => handleSettingChange('task.autoCheckTasks', !settings.task.autoCheckTasks)}
                  className={`toggle-switch ${settings.task.autoCheckTasks ? 'active' : ''}`}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-white">Auto Switch Tasks</span>
                  <Info className="w-4 h-4 text-white text-opacity-50" />
                </div>
                <button
                  onClick={() => handleSettingChange('task.autoSwitchTasks', !settings.task.autoSwitchTasks)}
                  className={`toggle-switch ${settings.task.autoSwitchTasks ? 'active' : ''}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Sound Settings */}
        {activeTab === 'sound' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Sound Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Alarm Sound
                </label>
                <select
                  value={settings.sound.alarmSound}
                  onChange={(e) => handleSettingChange('sound.alarmSound', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="Wood">Wood</option>
                  <option value="Digital">Digital</option>
                  <option value="Bell">Bell</option>
                  <option value="Chime">Chime</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.sound.alarmVolume}
                  onChange={(e) => handleSettingChange('sound.alarmVolume', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-right text-white text-opacity-70 text-sm mt-1">
                  {settings.sound.alarmVolume}%
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Repeat
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={settings.sound.alarmRepeat}
                  onChange={(e) => handleSettingChange('sound.alarmRepeat', parseInt(e.target.value))}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Ticking Sound
                </label>
                <select
                  value={settings.sound.tickingSound}
                  onChange={(e) => handleSettingChange('sound.tickingSound', e.target.value)}
                  className="input-field w-full"
                >
                  <option value="None">None</option>
                  <option value="Clock">Clock</option>
                  <option value="Metronome">Metronome</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings; 