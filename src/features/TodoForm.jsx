import React, { useState } from 'react';
import { useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';

function TodoForm({ onAddTodo, isSaving }) {
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
      <TextInputWithLabel
        ref={todoTitleInput}
        labelText="Todo"
        elementId="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <button type="submit" disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : ' Add Todo'}
      </button>
    </form>
  );
}

export default TodoForm;
