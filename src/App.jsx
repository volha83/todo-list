import './App.css';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import TodoListItem from './TodoListItem';
import React, { useState } from 'react';

function App() {
  const [todoList, setTodoList] = useState([]);

  function addTodo(title) {
    const newTodo = {
      title: title,
      id: Date.now(),
    };
    setTodoList([...todoList, newTodo]);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo} />

      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
