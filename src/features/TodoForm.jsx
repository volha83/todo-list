import React, { useState } from 'react';
import { useRef } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel';
import styled from 'styled-components';

const StyledForm = styled.form`
  display: flex;
  gap: 1em;
  padding: 0.5em;
`;

const StyledButton = styled.button`
  padding: 0.5em;
  background: #4caf50
  color: white;
  ${'' /* border: none; */}
  border-radius: 0.5em;
  cursor: pointer;

  &:disabled {
    background: #aaa;
    cursor: not-allowed;
    font-style: italic;
  }
`;

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef('');
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  function handleAddTodo(event) {
    event.preventDefault();

    onAddTodo(workingTodoTitle);
    setWorkingTodoTitle('');
    todoTitleInput.current.value = '';
    todoTitleInput.current.focus();
  }
  return (
    <StyledForm onSubmit={handleAddTodo}>
      <TextInputWithLabel
        ref={todoTitleInput}
        labelText="Todo"
        elementId="todoTitle"
        name="title"
        value={workingTodoTitle}
        onChange={(e) => setWorkingTodoTitle(e.target.value)}
      />
      <StyledButton type="submit" disabled={workingTodoTitle.trim() === ''}>
        {isSaving ? 'Saving...' : ' Add Todo'}
      </StyledButton>
    </StyledForm>
  );
}

export default TodoForm;
