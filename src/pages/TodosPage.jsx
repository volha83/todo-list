import TodoForm from '../features/TodoForm';
import TodoList from '../features/TodoList/TodoList';
import TodosViewForm from '../features/TodosViewForm';
import styles from '../App.module.css';

function TodosPage({
  todoList,
  isLoading,
  errorMessage,
  isSaving,
  addTodo,
  completeTodo,
  updateTodo,
  sortField,
  sortDirection,
  queryString,
  dispatch,
  todoActions,
}) {
  return (
    <div className={styles.appContainer}>
      {isLoading && <p>loading...</p>}
      {isSaving && <p>Saving...</p>}

      <TodoForm onAddTodo={addTodo} />

      <TodoList
        onCompleteTodo={completeTodo}
        todos={todoList}
        onUpdateTodo={updateTodo}
        isLoading={isLoading}
        isSaving={isSaving}
      />

      <hr />
      <TodosViewForm
        sortField={sortField}
        sortFieldChange={(field) =>
          dispatch({ type: todoActions.setSortField, sortField: field })
        }
        sortDirection={sortDirection}
        sortDirectionChange={(dir) =>
          dispatch({ type: todoActions.setSortDirection, sortDirection: dir })
        }
        queryString={queryString}
        queryStringChange={(query) =>
          dispatch({ type: todoActions.setQueryString, queryString: query })
        }
      />

      {/* display error */}
      {errorMessage && (
        <div className={styles.errorMessage}>
          <hr />

          <img
            src="/src/icons/triangle-exclamation-solid-full.svg"
            alt="Error icon"
            style={{
              width: '5em',
              height: '5em',
            }}
          />

          <p>{errorMessage}</p>
          <button onClick={() => dispatch({ type: todoActions.clearError })}>
            Dismiss Error Message
          </button>
        </div>
      )}
    </div>
  );
}

export default TodosPage;
