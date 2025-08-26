import React from 'react';
import TodoListItem from './TodoListItem';

function TodoList({ todos, onCompleteTodo, onUpdateTodo, isLoading }) {
  if (isLoading) {
    return <p>Todo loading...</p>;
  }

  if (todos.length === 0) {
    return <p>No todos yet!</p>;
  }

  const filteredTodoList = todos.filter((todo) => !todo.isCompleted);
  return (
    <>
      {filteredTodoList.length === 0 ? (
        <p>Add todo above to get started</p>
      ) : (
        <ul>
          {filteredTodoList.map((todo) => (
            <TodoListItem
              key={todo.id}
              todo={todo}
              onCompleteTodo={onCompleteTodo}
              onUpdateTodo={onUpdateTodo}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default TodoList;
