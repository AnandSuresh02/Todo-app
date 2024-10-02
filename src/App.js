import React, { useState } from 'react';
import TodoList from './components/TodoList';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);
  const addTodo = text => setTodos([...todos, { text, isEditing: false }]);
  const deleteTodo = index => setTodos(todos.filter((_, i) => i !== index));
  const editTodo = (index, text) => {
    const newTodos = [...todos];
    newTodos[index] = { ...newTodos[index], text, isEditing: false };
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <TodoList todos={todos} addTodo={addTodo} deleteTodo={deleteTodo} editTodo={editTodo} />
    </div>
  );
};

export default App;
