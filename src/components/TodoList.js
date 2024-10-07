import React, { useState } from 'react';
import TodoItem from './TodoItem';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  const addTodo = text => {
    if (text.trim()) {
      setTodos([...todos, { text, isEditing: false, subtasks: [], isDone: false }]);
    }
  };

  const deleteTodo = index => setTodos(todos.filter((_, i) => i !== index));
  const editTodo = (index, updatedTodo) => {
    const newTodos = [...todos];
    newTodos[index] = updatedTodo;
    setTodos(newTodos);
  };

  return (
    <div className="todo-list">
      <form onSubmit={e => {
        e.preventDefault();
        addTodo(e.target.elements.todo.value);
        e.target.elements.todo.value = '';
      }}>
        <input name="todo" placeholder="Add a new task" />
        <button type="submit">Add</button>
      </form>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} deleteTodo={() => deleteTodo(index)} editTodo={updatedTodo => editTodo(index, updatedTodo)} />
      ))}
    </div>
  );
};

export default TodoList;
