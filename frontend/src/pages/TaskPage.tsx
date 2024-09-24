import React, { useState, useEffect } from 'react';
import { getTasks, updateTask, deleteTask, searchTasks, Task } from '../services/api';
import TaskForm from '../components/TaskForm';

const TaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('タスクの取得中にエラーが発生しました。');
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
    setError(null);
  };

  const handleTaskUpdate = async (taskId: number, updatedData: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(taskId, updatedData);
      setTasks(prevTasks => prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const searchedTasks = await searchTasks({ query: filter });
      setTasks(searchedTasks);
    } catch (error) {
      console.error('Error searching tasks:', error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <TaskForm onTaskCreated={handleTaskCreated} />
      <div className="mb-4">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search tasks"
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleSearch}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className="bg-white p-4 mb-4 rounded shadow">
          {editingTask?.id === task.id ? (
            <TaskForm
              task={editingTask}
              onTaskCreated={(updatedTask) => {
                handleTaskUpdate(task.id, updatedTask);
              }}
              onCancel={() => setEditingTask(null)}
            />
          ) : (
            <>
              <h3 className="text-xl font-semibold">{task.title}</h3>
              <p>{task.description}</p>
              <p>Priority: {task.priority}</p>
              <p>Status: {task.status}</p>
              <p>Due Date: {task.dueDate}</p>
              <button
                onClick={() => setEditingTask(task)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleTaskUpdate(task.id, { status: task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED' })}
                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
              >
                {task.status === 'COMPLETED' ? 'Mark Incomplete' : 'Mark Complete'}
              </button>
              <button
                onClick={() => handleTaskDelete(task.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskPage;