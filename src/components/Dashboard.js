import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import TodoList from './TodoList';
import '../App.css';
import defaultProfilePic from '../images/defaultProfilePic.png';

const App = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const addTodo = text => setTodos([...todos, { text, isEditing: false }]);
  const deleteTodo = index => setTodos(todos.filter((_, i) => i !== index));
  const editTodo = (index, text) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], text, isEditing: false };
    setTodos(newTodos);
  };

  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profilePic = user.photoURL || defaultProfilePic;

  const handleSignOut = () => {
    auth.signOut();
    navigate('/login');
  };

  return (
    <div className="app">
      <nav>
        <h2>Todo App</h2>
        <div className="profile">
        <img src={profilePic} alt="Profile" onClick={() => setProfileOpen(!profileOpen)} />
        {profileOpen && (
            <div className="profile-dropdown">
              <button onClick={handleSignOut}>Sign Out</button>
              <button onClick={() => navigate('/settings')}>Settings</button>
            </div>
          )}
        </div>
      </nav>
      <h1>Todo List</h1>
      <TodoList todos={todos} addTodo={addTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
    </div>
  );
};

export default App;
