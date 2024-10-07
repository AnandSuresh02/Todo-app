import React, { useState } from 'react';

const TodoItem = ({ todo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(todo.isEditing);
  const [editInput, setEditInput] = useState(todo.text);
  const [subtasks, setSubtasks] = useState(todo.subtasks || []);
  const [isExpanded, setIsExpanded] = useState(false);

  const addSubtask = text => {
    const newSubtasks = [...subtasks, { text, isEditing: false }];
    setSubtasks(newSubtasks);
    editTodo({ ...todo, subtasks: newSubtasks });
  };

  const deleteSubtask = index => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
    editTodo({ ...todo, subtasks: newSubtasks });
  };

  const editSubtask = (index, updatedSubtask) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = updatedSubtask;
    setSubtasks(newSubtasks);
    editTodo({ ...todo, subtasks: newSubtasks });
  };

  return (
    <div className={`todo-item ${isExpanded ? 'expanded' : ''}`}>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            editTodo({ ...todo, text: editInput });
            setIsEditing(false);
          }}
        >
          <input value={editInput} onChange={e => setEditInput(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="todo-main">
          <span>{todo.text}</span>
          <div className="buttons">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteTodo}>Delete</button>
            <button onClick={() => setIsExpanded(!isExpanded)}>
              <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>&#9660;</span>
            </button>
          </div>
        </div>
      )}
      {isExpanded && (
        <div className="subtasks">
          {subtasks.map((subtask, index) => (
            <SubtaskItem
              key={index}
              subtask={subtask}
              deleteSubtask={() => deleteSubtask(index)}
              editSubtask={updatedSubtask => editSubtask(index, updatedSubtask)}
            />
          ))}
          <form
            onSubmit={e => {
              e.preventDefault();
              addSubtask(e.target.elements.subtask.value);
              e.target.elements.subtask.value = '';
            }}
          >
            <input name="subtask" placeholder="Add a subtask" />
            <button type="submit">Add</button>
          </form>
        </div>
      )}
    </div>
  );
};

const SubtaskItem = ({ subtask, deleteSubtask, editSubtask }) => {
  const [isEditing, setIsEditing] = useState(subtask.isEditing);
  const [editInput, setEditInput] = useState(subtask.text);

  return (
    <div className="subtask-item">
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            editSubtask({ text: editInput, isEditing: false });
            setIsEditing(false);
          }}
        >
          <input value={editInput} onChange={e => setEditInput(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <span>{subtask.text}</span>
          <div className="subtask-buttons">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteSubtask}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;
