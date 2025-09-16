import { useState, useEffect } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';
import styles from './TodoListItem.module.css';
import checkIcon from '../../icons/check-solid-full.svg';
// import circleIcon from '../../icons/circle-regular-full.svg';

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event) {
    if (!isEditing) return;
    event.preventDefault();
    onUpdateTodo({
      ...todo,
      title: workingTitle,
    });
    setIsEditing(false);
  }

  return (
    <li className={`${styles.todoItem}`}>
      <form>
        {isEditing ? (
          <>
            <TextInputWithLabel value={workingTitle} onChange={handleEdit} />
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
            <button type="button" onClick={handleUpdate}>
              Update
            </button>
          </>
        ) : (
          <>
            {/* <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              /> */}
            <button
              type="button"
              onClick={() => onCompleteTodo(todo.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <img
                // src={todo.isCompleted ? checkIcon : checkIcon}
                src={checkIcon}
                width="20"
                height="20"
              />
            </button>

            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}
export default TodoListItem;
