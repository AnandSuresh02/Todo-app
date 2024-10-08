import React, { useState, useEffect } from 'react';

const TodoItem = ({ todo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(todo.isEditing);
  const [editInput, setEditInput] = useState(todo.text);
  const [subtasks, setSubtasks] = useState(todo.subtasks || []);
  const [isExpanded, setIsExpanded] = useState(false);
  const [description, setDescription] = useState(todo.description || '');
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [createdDate] = useState(todo.createdAt ? new Date(todo.createdAt) : new Date());
  const [updatedDate, setUpdatedDate] = useState(todo.updatedAt ? new Date(todo.updatedAt) : null);

  useEffect(() => {
    if (isEditingDescription === false) {
      editTodo({
        ...todo,
        description,
        updatedAt: new Date().toISOString(),
      });
      setUpdatedDate(new Date());
    }
  }, [isEditingDescription]);

  const toggleDone = () => {
    const newSubtasks = subtasks.map(subtask => ({
      ...subtask,
      isDone: !todo.isDone,
      updatedAt: new Date().toISOString(),
    }));
    setSubtasks(newSubtasks);
    editTodo({
      ...todo,
      isDone: !todo.isDone,
      subtasks: newSubtasks,
      updatedAt: new Date().toISOString(),
    });
    setUpdatedDate(new Date());
  };

  const addSubtask = text => {
    if (text.trim()) {
      const newSubtask = {
        text,
        isEditing: false,
        isDone: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const newSubtasks = [...subtasks, newSubtask];
      setSubtasks(newSubtasks);
      editTodo({
        ...todo,
        subtasks: newSubtasks,
        updatedAt: new Date().toISOString(),
      });
      setUpdatedDate(new Date());
    }
  };

  const deleteSubtask = index => {
    const newSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(newSubtasks);
    editTodo({
      ...todo,
      subtasks: newSubtasks,
      updatedAt: new Date().toISOString(),
    });
    setUpdatedDate(new Date());
  };

  const editSubtask = (index, updatedSubtask) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = {
      ...updatedSubtask,
      updatedAt: new Date().toISOString(),
    };
    setSubtasks(newSubtasks);
    editTodo({
      ...todo,
      subtasks: newSubtasks,
      updatedAt: new Date().toISOString(),
    });
    setUpdatedDate(new Date());
  };

  const toggleSubtaskDone = index => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = {
      ...newSubtasks[index],
      isDone: !newSubtasks[index].isDone,
      updatedAt: new Date().toISOString(),
    };
    setSubtasks(newSubtasks);
    editTodo({
      ...todo,
      subtasks: newSubtasks,
      updatedAt: new Date().toISOString(),
    });
    setUpdatedDate(new Date());
  };

  const exportToMarkdown = () => {
    const completed = subtasks.filter(subtask => subtask.isDone);
    const pending = subtasks.filter(subtask => !subtask.isDone);
    const markdown = `# ${todo.text}\n\n## Summary: ${completed.length}/${
      subtasks.length
    } todos completed.\n\n## Pending\n\n${pending
      .map(subtask => `- [ ] ${subtask.text}`)
      .join('\n')}\n\n## Completed\n\n${completed
      .map(subtask => `- [x] ${subtask.text}`)
      .join('\n')}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${todo.text.replace(/ /g, '_')}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`todo-item ${isExpanded ? 'expanded' : ''}`}>
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editInput.trim()) {
              editTodo({
                ...todo,
                text: editInput,
                updatedAt: new Date().toISOString(),
              });
              setIsEditing(false);
              setUpdatedDate(new Date());
            }
          }}
        >
          <input value={editInput} onChange={e => setEditInput(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      ) : (
        <div className="todo-main">
          <div className="main-content">
            <input type="checkbox" checked={todo.isDone} onChange={toggleDone} />
            <span className={todo.isDone ? 'done' : ''}>{todo.text}</span>
          </div>
          <div className="buttons">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteTodo}>Delete</button>
            <button onClick={() => setIsExpanded(!isExpanded)}>
              <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>&#9660;</span>
            </button>
            {isExpanded && <button onClick={exportToMarkdown}>Export as Gist</button>}
          </div>
        </div>
      )}
      {isExpanded && (
        <div className="expanded-content">
          {description ? (
            <div>
              {isEditingDescription ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    setIsEditingDescription(false);
                  }}
                >
                  <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <button type="submit">Save</button>
                </form>
              ) : (
                <p onClick={() => setIsEditingDescription(true)}>{description}</p>
              )}
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setDescription(e.target.elements.description.value);
                setIsEditingDescription(false);
              }}
            >
              <input name="description" placeholder="Add a description" />
              <button type="submit">Add</button>
            </form>
          )}

          <div className="subtasks">
            {subtasks.map((subtask, index) => (
              <SubtaskItem
                key={index}
                subtask={subtask}
                deleteSubtask={() => deleteSubtask(index)}
                editSubtask={updatedSubtask => editSubtask(index, updatedSubtask)}
                toggleSubtaskDone={() => toggleSubtaskDone(index)}
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
          <div className="timestamps">
            <p>Created: {createdDate.toLocaleString()}</p>
            {updatedDate && <p>Updated: {updatedDate.toLocaleString()}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

const SubtaskItem = ({ subtask, deleteSubtask, editSubtask, toggleSubtaskDone }) => {
  const [isEditing, setIsEditing] = useState(subtask.isEditing);
  const [editInput, setEditInput] = useState(subtask.text);
  const [updatedDate, setUpdatedDate] = useState(subtask.updatedAt ? new Date(subtask.updatedAt) : null);

  return (
    <div className="subtask-item">
      {isEditing ? (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (editInput.trim()) {
              editSubtask({
                ...subtask,
                text: editInput,
                isEditing: false,
                updatedAt: new Date().toISOString(),
              });
              setIsEditing(false);
              setUpdatedDate(new Date());
            }
          }}
        >
          <input value={editInput} onChange={e => setEditInput(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <div className="subtask-content">
            <input type="checkbox" checked={subtask.isDone} onChange={toggleSubtaskDone} />
            <span className={subtask.isDone ? 'done' : ''}>{subtask.text}</span>
          </div>
          <div className="subtask-buttons">
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteSubtask}>Delete</button>
          </div>
        </>
      )}
      <div className="timestamps">
        {subtask.createdAt && <p>Created: {new Date(subtask.createdAt).toLocaleString()}</p>}
        {updatedDate && <p>Updated: {updatedDate.toLocaleString()}</p>}
      </div>
    </div>
  );
};

export default TodoItem;
