import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, List, Crown, Clock, Calendar, Flame } from 'lucide-react';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [period]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reports?period=${period}`);
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to load report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: TrendingUp },
    { id: 'detail', label: 'Detail', icon: List },
    { id: 'ranking', label: 'Ranking', icon: Crown }
  ];

  const periods = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'year', label: 'Year' }
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="card">
          <div className="text-center text-white text-opacity-70">
            Loading report data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Report</h1>
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

        {/* Period Selector */}
        <div className="flex space-x-2 mb-8">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                period === p.id
                  ? 'tab-active'
                  : 'tab-inactive'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary Tab */}
        {activeTab === 'summary' && reportData && (
          <div className="space-y-8">
            {/* Activity Summary */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Activity Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {reportData.activitySummary.hoursFocused}
                    </div>
                    <div className="text-white text-opacity-70 text-sm">hours focused</div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {reportData.activitySummary.daysAccessed}
                    </div>
                    <div className="text-white text-opacity-70 text-sm">days accessed</div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center space-x-3">
                  <Flame className="w-6 h-6 text-white" />
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {reportData.activitySummary.dayStreak}
                    </div>
                    <div className="text-white text-opacity-70 text-sm">day streak</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Hours */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Focus Hours</h2>
              <div className="bg-white bg-opacity-5 rounded-lg p-6">
                <div className="grid grid-cols-7 gap-2">
                  {reportData.dailyStats.map((day, index) => (
                    <div key={index} className="text-center">
                      <div className="text-white text-opacity-70 text-sm mb-2">
                        {new Date(day._id.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div 
                        className="bg-white bg-opacity-20 rounded"
                        style={{ 
                          height: `${Math.max(day.focusHours * 100, 4)}px`,
                          minHeight: '4px'
                        }}
                      />
                      <div className="text-white text-xs mt-1">
                        {day.focusHours.toFixed(1)}h
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detail Tab */}
        {activeTab === 'detail' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Focus Time Detail</h2>
            <div className="bg-white bg-opacity-5 rounded-lg p-6">
              <div className="text-center text-white text-opacity-70">
                Detailed session data will be displayed here
              </div>
            </div>
          </div>
        )}

        {/* Ranking Tab */}
        {activeTab === 'ranking' && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Focus Time This Week</h2>
            <div className="bg-white bg-opacity-5 rounded-lg p-6">
              <div className="text-center text-white text-opacity-70">
                User rankings will be displayed here
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports; 