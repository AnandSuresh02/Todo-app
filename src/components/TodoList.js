import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [currentUser, loading, error] = useAuthState(auth);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!currentUser) return;

      const todosCollection = collection(db, 'todos');
      const q = query(todosCollection, where('userId', '==', currentUser.uid));
      const todosSnapshot = await getDocs(q);
      const todosList = todosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTodos(todosList);
    };

    fetchTodos();
  }, [currentUser]);

  const addTodo = async text => {
    if (text.trim() && currentUser) {
      const newTodo = {
        text,
        isEditing: false,
        subtasks: [],
        isDone: false,
        userId: currentUser.uid,
      };
      const docRef = await addDoc(collection(db, 'todos'), newTodo);
      setTodos([...todos, { ...newTodo, id: docRef.id }]);
    }
  };

  const deleteTodo = async id => {
    await deleteDoc(doc(db, 'todos', id));
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = async (id, updatedTodo) => {
    const todoDoc = doc(db, 'todos', id);
    await updateDoc(todoDoc, updatedTodo);
    setTodos(todos.map(todo => (todo.id === id ? { ...updatedTodo, id } : todo)));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="todo-list">
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo(e.target.elements.todo.value);
          e.target.elements.todo.value = '';
        }}
      >
        <input name="todo" placeholder="Add a new task" />
        <button type="submit">Add</button>
      </form>
      {todos.map((todo, index) => (
        <TodoItem
          key={index}
          todo={todo}
          deleteTodo={() => deleteTodo(todo.id)}
          editTodo={updatedTodo => editTodo(todo.id, updatedTodo)}
        />
      ))}
    </div>
  );
};

export default TodoList;
