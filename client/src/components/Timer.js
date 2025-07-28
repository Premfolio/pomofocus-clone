import React from 'react';
import { useTimer } from '../contexts/TimerContext';
import { useSettings } from '../contexts/SettingsContext';
import { Play, Pause, RotateCcw } from 'lucide-react';

const Timer = () => {
  const {
    isRunning,
    timeLeft,
    timerType,
    timerTypes,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    switchTimerType,
    formatTime,
    getTimerMessage
  } = useTimer();

  const { settings } = useSettings();

  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const handleStop = () => {
    stopTimer();
  };

  const handleReset = () => {
    resetTimer();
  };

  const handleTabClick = (type) => {
    switchTimerType(type);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Timer Type Tabs */}
        <div className="flex space-x-1 mb-8">
          {Object.entries(timerTypes).map(([type, config]) => (
            <button
              key={type}
              onClick={() => handleTabClick(type)}
              disabled={isRunning}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                timerType === type
                  ? 'tab-active'
                  : 'tab-inactive'
              } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {config.name}
            </button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center mb-8">
          <div className={`timer-display ${isRunning ? 'timer-pulse' : ''}`}>
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={handleStartPause}
            className="btn-primary flex items-center space-x-2"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>START</span>
              </>
            )}
          </button>

          {isRunning && (
            <button
              onClick={handleStop}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>STOP</span>
            </button>
          )}
        </div>

        {/* Timer Message */}
        <div className="text-center text-white text-opacity-80">
          {getTimerMessage()}
        </div>
      </div>
    </div>
  );
};

export default Timer; 