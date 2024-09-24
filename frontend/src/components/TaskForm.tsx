import React, { useState } from 'react';
import { createTask, updateTask, Task } from '../services/api';

interface TaskFormProps {
  task?: Task;
  onTaskCreated: (task: Task) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onTaskCreated, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'MEDIUM');
  const [status, setStatus] = useState(task?.status || 'NOT_STARTED');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = { title, description, priority, status, dueDate };
    try {
      let newOrUpdatedTask;
      if (task) {
        newOrUpdatedTask = await updateTask(task.id, taskData);
      } else {
        newOrUpdatedTask = await createTask(taskData);
      }
      onTaskCreated(newOrUpdatedTask);
      // フォームをリセット
      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('NOT_STARTED');
      setDueDate('');
    } catch (error) {
      console.error('タスクの作成/更新中にエラーが発生しました:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full px-3 py-2 mb-2 border rounded"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
        className="w-full px-3 py-2 mb-2 border rounded"
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full px-3 py-2 mb-2 border rounded"
      >
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-3 py-2 mb-2 border rounded"
      >
        <option value="NOT_STARTED">Not Started</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="COMPLETED">Completed</option>
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full px-3 py-2 mb-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        {task ? 'Update Task' : 'Create Task'}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default TaskForm;