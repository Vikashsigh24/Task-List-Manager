import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskTable from './components/Table';
import TaskForm from './components/TaskForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // Search query state

  // Fetch initial data
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/todos')
      .then(response => response.json())
      .then(data => {
        const mappedData = data.slice(0, 20).map(task => ({
          id: task.id,
          title: task.title,
          description: '',
          status: task.completed ? 'Done' : 'To Do',
        }));
        setTasks(mappedData);
      })
      .catch(() => {
        toast.error('Failed to load tasks.');
      });
  }, []);

  // Add a new task
  const addTask = (task) => {
    setTasks(prevTasks => [...prevTasks, task]);
    toast.success('Task added successfully!');
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.info(`Task with ID ${taskId} deleted.`);
  };

  // Edit a task (status change or title/description change)
  const editTask = (updatedTask) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    toast.success('Task edited successfully!');
  };

  // Filter tasks by status and search query
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filteredStatus ? task.status === filteredStatus : true;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task List Manager</h1>

      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Search Bar */}
      <div className="mb-4">
        <label htmlFor="search" className="mr-2 font-semibold">Search Tasks:</label>
        <input
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or description"
          className="border rounded p-2 w-full sm:w-1/2"
        />
      </div>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label htmlFor="filter" className="mr-2 font-semibold">Filter by Status:</label>
        <select
          id="filter"
          value={filteredStatus}
          onChange={(e) => setFilteredStatus(e.target.value)}
          className="border rounded p-2"
        >
          <option value="">All</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      {/* Add Task Form */}
      <TaskForm addTask={addTask} />

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks} // Pass filtered tasks to the table
        deleteTask={deleteTask}
        editTask={editTask} // Pass editTask function to Table
      />
    </div>
  );
}

export default App;
