import './App.css';
import TodoList from './features/TodoList/TodoList';
import TodoForm from './features/TodoForm';
// import TodoListItem from './features/TodoList/TodoListItem';
import React, { useState, useEffect } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const [isSaving, setIsSaving] = useState(false);

  const url = `https://api.airtable.com/v0/${import.meta.env.VITE_BASE_ID}/${import.meta.env.VITE_TABLE_NAME}`;
  const token = `Bearer ${import.meta.env.VITE_PAT}`;

  // **************
  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);

      const options = {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      };

      try {
        const resp = await fetch(url, options);

        if (!resp.ok) {
          throw new Error(resp.statusText || `Error: ${resp.status}`);
        }

        const data = await resp.json();

        const todos = data.records.map((record) => ({
          id: record.id,
          title: record.fields.title || 'Untitled',
          isCompleted: record.fields.isCompleted || false,
        }));

        setTodoList(todos);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  //************************** */

  function addTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
  }

  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isCompleted: !todo.isCompleted,
        };
      }
      return todo;
    });
    setTodoList(updatedTodos);
  }

  function updateTodo(editedTodo) {
    const updatedTodos = todoList.map((todo) =>
      todo.id === editedTodo.id ? { ...editedTodo } : todo
    );
    setTodoList(updatedTodos);
  }

  return (
    <div>
      <h1>Todo List</h1>

      {errorMessage && <p>{errorMessage}</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        onCompleteTodo={completeTodo}
        todos={todoList}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;
