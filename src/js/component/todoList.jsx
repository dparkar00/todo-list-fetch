import React, { useState, useEffect } from 'react';




export default function ToDoList() {
  const [tasks, setTasks] = useState([]);       
  const [newTask, setNewTask] = useState("");  
  const [error, setError] = useState("");
  
  useEffect(() => {
      fetchTasks();
  }, [])

  const fetchTasks = () => {
      fetch("https://playground.4geeks.com/todo/users/MKirby")
      .then(response => response.json())
      .then(data => setTasks(data.todos || []))
      .catch(error => {
          console.error('Error loading the tasks', error);
          setError("Failed to load tasks. Please try again");
      });
  };


  

  function handleInputChange(event) {
      setNewTask(event.target.value);
  }

  function handleKeyPress(event) {
      if (event.key === 'Enter' && newTask.trim() !== "") {
          addTask();
      }
  }

  const addTask = () => {
      const taskData = { label: newTask, is_done: false};
      fetch('https://playground.4geeks.com/todo/todos/MKirby', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(taskData)
      })
      .then(response => response.json())
      .then(data => {
          setTasks(prevTasks => [...prevTasks, data]);
          setNewTask("")
      })
      .catch(error => {
          console.error("error adding task:", error);
          setError("Failed to add task. Please Try Again.");
      });
  };

  const updateTask = (taskId, label, is_done) => {
      fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
          method: 'PUT', 
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({label, is_done})
      })
      .then(response => response.json())
      .then(() => {
          const updatedTasks = tasks.map(task => task.id === taskId ? {...task, label, is_done} : task);
          setTasks(updatedTasks);
      })
      .catch(error => {
          console.error('Error updating task:'. error);
          setError('Failed to update task. Please try again.');
      });
  };


  const deleteTask = (taskId) => {
      fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
          method: 'DELETE'
      })
      .then(() => {
          const updatedTasks = tasks.filter(task => task.id !== taskId);
          setTasks(updatedTasks);
      })
      .catch(error => {
          console.error('Error deleting task:', error);
          setError("failed to delete task. Please try again");
      });
  };

  return (
      <div className="toDoList">
          <h1>To Do List</h1>
          {error && <p className="error">{error}</p>}
          <div>
              <input type="text" placeholder="Enter Task" value={newTask} onChange={e => setNewTask(e.target.value)} onKeyPress={e => e.key === 'Enter' ? addTask() : null}  />
              <button className="addButton" onClick={addTask}>+</button>
          </div>
          <ol>
              {tasks.map((task) => (
                  <li key={task.id}>
                    <input
                      type="checkbox"
                      checked={task.is_done}
                      onChange={e => updateTask(task.id, task.label, e.target.checked)}
                      />
                      {task.label}
                      <button className="deleteButton" onClick={() => deleteTask(task.id)}>X</button>
                  </li>
              ))}
          </ol>
      </div>
  );
}
