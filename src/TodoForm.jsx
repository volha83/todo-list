import React from 'react';
import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');

  function handleAddTodo(event) {
    event.preventDefault();
    console.dir(event.target.title);

    const title = todoTitleInput.current.value;
    onAddTodo(title);

    todoTitleInput.current.value = '';
    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input ref={todoTitleInput} type="text" id="todoTitle" name="title" />
      <button type="submit"> Add Todo </button>
    </form>
  );
}

export default TodoForm;
