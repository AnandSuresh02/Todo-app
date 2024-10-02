import React, { useState } from 'react';

const TodoList = ({ todos, addTodo, deleteTodo, editTodo }) => {
  const [input, setInput] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    addTodo(input);
    setInput('');
  };

  return (
    <div className="todo-list">
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add a new task" />
        <button type="submit">Add</button>
      </form>
      {todos.map((todo, index) => (
        <TodoItem key={index} todo={todo} deleteTodo={() => deleteTodo(index)} editTodo={text => editTodo(index, text)} />
      ))}
    </div>
  );
};

const TodoItem = ({ todo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(todo.isEditing);
  const [editInput, setEditInput] = useState(todo.text);

  return (
    <div className="todo-item">
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            editTodo(editInput);
            setIsEditing(false);
          }}
        >
          <input value={editInput} onChange={e => setEditInput(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <span>{todo.text}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={deleteTodo}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TodoList;
