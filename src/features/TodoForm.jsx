import React, { useState } from 'react';
import { useRef } from 'react';

function TodoForm({ onAddTodo }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();
    // console.dir(todoTitleInput.current.title);

    // const title = todoTitleInput.current.value;
    onAddTodo(workingTodoTitle);

    setWorkingTodoTitle('');
    todoTitleInput.current.value = '';
    todoTitleInput.current.focus();
  }
  return (
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
      <input
        ref={todoTitleInput}
        type="text"
        id="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={!workingTodoTitle}>
        {' '}
        Add Todo{' '}
      </button>
    </form>
  );
}

export default TodoForm;
