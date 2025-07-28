import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, MoreVertical, CheckCircle, Circle, Trash2, Edit3 } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  // Load tasks
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const response = await axios.post('/api/tasks', {
        title: newTask.trim(),
        project: 'No Project'
      });
      
      setTasks([response.data, ...tasks]);
      setNewTask('');
      setShowAddTask(false);
      toast.success('Task added successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add task';
      toast.error(message);
    }
  };

  // Toggle task completion
  const toggleTask = async (taskId) => {
    try {
      const response = await axios.patch(`/api/tasks/${taskId}/toggle`);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
      toast.success(response.data.completed ? 'Task completed!' : 'Task uncompleted');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  // Update task pomodoros
  const updatePomodoros = async (taskId, pomodoros) => {
    try {
      const response = await axios.patch(`/api/tasks/${taskId}/pomodoros`, {
        completedPomodoros: pomodoros
      });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (error) {
      toast.error('Failed to update pomodoros');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="text-center text-white text-opacity-70">
            Loading tasks...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Tasks</h2>
          <button className="text-white text-opacity-70 hover:text-white">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Task Input */}
        {showAddTask && (
          <form onSubmit={handleAddTask} className="mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What are you working on?"
              className="input-field w-full mb-4"
              autoFocus
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={!newTask.trim()}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAddTask(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="space-y-2 mb-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-item flex items-center space-x-3 p-3 rounded-lg border border-white border-opacity-10 ${
                task.completed ? 'opacity-60' : ''
              }`}
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTask(task._id)}
                className="text-white hover:text-green-400 transition-colors"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              {/* Task Content */}
              <div className="flex-1">
                <div className={`${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </div>
                {task.project && task.project !== 'No Project' && (
                  <div className="text-sm text-white text-opacity-60">
                    {task.project}
                  </div>
                )}
              </div>

              {/* Pomodoros */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white text-opacity-70">
                  {task.completedPomodoros}/{task.estimatedPomodoros}
                </span>
                <button
                  onClick={() => updatePomodoros(task._id, Math.max(0, task.completedPomodoros - 1))}
                  className="text-white text-opacity-70 hover:text-white"
                  disabled={task.completedPomodoros <= 0}
                >
                  -
                </button>
                <button
                  onClick={() => updatePomodoros(task._id, task.completedPomodoros + 1)}
                  className="text-white text-opacity-70 hover:text-white"
                  disabled={task.completedPomodoros >= task.estimatedPomodoros}
                >
                  +
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button className="text-white text-opacity-70 hover:text-white">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-white text-opacity-70 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        {!showAddTask && (
          <button
            onClick={() => setShowAddTask(true)}
            className="w-full border-2 border-dashed border-white border-opacity-30 rounded-lg p-6 text-white text-opacity-70 hover:text-white hover:border-opacity-50 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </button>
        )}

        {/* Empty State */}
        {tasks.length === 0 && !showAddTask && (
          <div className="text-center text-white text-opacity-70 py-8">
            <p>No tasks yet. Add your first task to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks; 