import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Admin = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const tasksCollection = collection(db, 'todos');
      const tasksSnapshot = await getDocs(tasksCollection);
      const tasksList = tasksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, []);

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Subtasks</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.text}</td>
              <td>
                {task.subtasks.map((subtask, index) => (
                  <div key={index} className={subtask.isDone ? 'done' : ''}>
                    {subtask.text}
                  </div>
                ))}
              </td>
              <td>{task.isDone ? 'Completed' : 'Pending'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
